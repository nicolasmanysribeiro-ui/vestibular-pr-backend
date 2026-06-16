import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private client: Anthropic;

  constructor(private prisma: PrismaService) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * RAG: Recupera questões reais similares e gera nova questão no mesmo estilo
   */
  async generateQuestion(
    universityId: string,
    disciplineId: string,
    difficulty: 'FACIL' | 'MEDIO' | 'DIFICIL',
  ) {
    const realQuestions = await this.prisma.realQuestion.findMany({
      where: { universityId, disciplineId, difficulty },
      orderBy: { year: 'desc' },
      take: 4,
      include: {
        university: { select: { name: true, acronym: true } },
        discipline: { select: { name: true } },
      },
    });

    const university = await this.prisma.university.findUnique({
      where: { id: universityId },
      select: { name: true, acronym: true },
    });

    const discipline = await this.prisma.discipline.findUnique({
      where: { id: disciplineId },
      select: { name: true },
    });

    const contextBlock =
      realQuestions.length > 0
        ? realQuestions
            .map(
              (q, i) =>
                `--- Questão ${i + 1} (${q.university.acronym} ${q.year}) ---\n` +
                `Enunciado: ${q.statement}\n` +
                `Resposta correta: ${q.correctAnswer}\n` +
                `Explicação: ${q.explanation}`,
            )
            .join('\n\n')
        : 'Não há questões reais disponíveis como referência. Use seu conhecimento sobre o estilo da banca.';

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: `Você é um especialista em criação de questões para vestibulares brasileiros.
Seu papel é criar questões ORIGINAIS que imitam o estilo e o padrão de raciocínio exigido 
pela banca examinadora da universidade fornecida.

IMPORTANTE:
- NÃO copie ou parafraseie questões existentes
- Crie enunciados completamente novos
- Mantenha o nível de dificuldade solicitado
- Use o mesmo padrão de raciocínio das questões de referência
- Responda APENAS com JSON válido, sem markdown ou texto adicional`,
      messages: [
        {
          role: 'user',
          content: `Crie uma questão de ${discipline!.name} para o vestibular da ${university!.name} (${university!.acronym}).
          
Dificuldade: ${difficulty}

QUESTÕES DE REFERÊNCIA DA BANCA (use como padrão de estilo):
${contextBlock}

Responda SOMENTE com este JSON:
{
  "statement": "enunciado completo da questão",
  "alternatives": [
    {"id": "A", "text": "texto da alternativa A"},
    {"id": "B", "text": "texto da alternativa B"},
    {"id": "C", "text": "texto da alternativa C"},
    {"id": "D", "text": "texto da alternativa D"},
    {"id": "E", "text": "texto da alternativa E"}
  ],
  "correct_answer": "letra da alternativa correta (A-E)",
  "explanation": "explicação detalhada do por que a resposta está correta e as demais erradas"
}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Resposta inesperada da IA');

    let parsed: {
      statement: string;
      alternatives: { id: string; text: string }[];
      correct_answer: string;
      explanation: string;
    };

    try {
      parsed = JSON.parse(content.text.replace(/```json|```/g, '').trim());
    } catch {
      throw new Error('IA retornou JSON inválido');
    }

    const saved = await this.prisma.aiQuestion.create({
      data: {
        baseUniversityId: universityId,
        disciplineId,
        difficulty,
        questionType: 'MULTIPLA_ESCOLHA',
        statement: parsed.statement,
        alternatives: parsed.alternatives,
        correctAnswer: parsed.correct_answer,
        explanation: parsed.explanation,
        inspiredBy: realQuestions[0]?.id ?? null,
      },
    });

    return { ...saved, source: 'ai' as const };
  }

  /**
   * Analisa o erro do aluno e gera feedback personalizado
   */
  async analyzeError(
    questionId: string,
    userAnswer: string,
    isRealQuestion: boolean,
  ): Promise<string> {
    const question = isRealQuestion
      ? await this.prisma.realQuestion.findUnique({ where: { id: questionId } })
      : await this.prisma.aiQuestion.findUnique({ where: { id: questionId } });

    if (!question) throw new Error('Questão não encontrada');

    const alternatives = question.alternatives as { id: string; text: string }[];
    const wrongAlternative = alternatives?.find((a) => a.id === userAnswer);
    const correctAlternative = alternatives?.find((a) => a.id === question.correctAnswer);

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: `Você é um tutor pedagógico especialista em vestibulares brasileiros.
Seu papel é ajudar o aluno a entender seus erros de forma clara, didática e motivadora.
Seja direto, use linguagem acessível para estudantes do ensino médio.`,
      messages: [
        {
          role: 'user',
          content: `Um estudante errou esta questão de vestibular:

QUESTÃO: ${question.statement}

RESPOSTA DO ALUNO: ${userAnswer}) ${wrongAlternative?.text || ''}
RESPOSTA CORRETA: ${question.correctAnswer}) ${correctAlternative?.text || ''}

EXPLICAÇÃO OFICIAL: ${question.explanation}

Forneça:
1. **Por que errou:** Uma linha explicando o raciocínio incorreto comum
2. **Por que é errada:** Explique o erro específico da alternativa escolhida
3. **Por que está certa:** Explique a resposta correta de forma simples  
4. **Dica para não errar mais:** Uma técnica ou memorização prática
5. **Revise:** Cite o conteúdo/tópico específico para revisar (2-3 palavras)

Seja encorajador e use emojis moderadamente.`,
        },
      ],
    });

    return (message.content[0] as { type: 'text'; text: string }).text;
  }

  /**
   * Gera relatório de nivelamento após avaliação diagnóstica
   */
  async generateLevelingReport(results: {
    discipline: string;
    total: number;
    correct: number;
    score: number;
  }[]): Promise<{
    overallScore: number;
    level: string;
    report: string;
    skillsRadar: Record<string, number>;
  }> {
    const overallScore =
      results.reduce((sum, r) => sum + r.score, 0) / results.length;

    const level =
      overallScore >= 7.5 ? 'Avançado'
      : overallScore >= 5.0 ? 'Intermediário'
      : 'Iniciante';

    const skillsRadar: Record<string, number> = {};
    results.forEach((r) => {
      skillsRadar[r.discipline] = r.score;
    });

    const resultsText = results
      .map(
        (r) =>
          `${r.discipline}: ${r.correct}/${r.total} acertos (${r.score.toFixed(1)})`,
      )
      .join('\n');

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Analise o desempenho deste estudante no teste de nivelamento para vestibular:

${resultsText}

Nota geral: ${overallScore.toFixed(1)}/10
Nível estimado: ${level}

Escreva um relatório personalizado de 4-5 linhas que:
1. Reconheça os pontos fortes
2. Identifique as maiores dificuldades
3. Sugira uma estratégia de estudo priorizada
4. Seja motivador e realista

Escreva diretamente para o estudante (use "você"). Sem formatação markdown.`,
        },
      ],
    });

    const report = (message.content[0] as { type: 'text'; text: string }).text;

    return { overallScore, level, report, skillsRadar };
  }
}