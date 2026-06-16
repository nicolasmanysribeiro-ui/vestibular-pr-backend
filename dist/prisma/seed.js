"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const UNIVERSITIES = [
    {
        name: 'Universidade Federal do Paraná',
        acronym: 'UFPR',
        state: 'PR',
        website: 'https://www.ufpr.br',
        description: 'Primeira universidade federal do Brasil, fundada em 1912, em Curitiba.',
    },
    {
        name: 'Universidade Tecnológica Federal do Paraná',
        acronym: 'UTFPR',
        state: 'PR',
        website: 'https://www.utfpr.edu.br',
        description: 'Única universidade tecnológica federal do Brasil, com múltiplos campi no Paraná.',
    },
    {
        name: 'Universidade Estadual de Londrina',
        acronym: 'UEL',
        state: 'PR',
        website: 'https://www.uel.br',
    },
    {
        name: 'Universidade Estadual de Maringá',
        acronym: 'UEM',
        state: 'PR',
        website: 'https://www.uem.br',
    },
    {
        name: 'Universidade Estadual de Ponta Grossa',
        acronym: 'UEPG',
        state: 'PR',
        website: 'https://www.uepg.br',
    },
    {
        name: 'Universidade Estadual do Oeste do Paraná',
        acronym: 'UNIOESTE',
        state: 'PR',
        website: 'https://www.unioeste.br',
    },
    {
        name: 'Universidade Estadual do Centro-Oeste',
        acronym: 'UNICENTRO',
        state: 'PR',
        website: 'https://www.unicentro.br',
    },
    {
        name: 'Pontifícia Universidade Católica do Paraná',
        acronym: 'PUCPR',
        state: 'PR',
        website: 'https://www.pucpr.br',
    },
    {
        name: 'Universidade Positivo',
        acronym: 'UP',
        state: 'PR',
        website: 'https://www.up.edu.br',
    },
    {
        name: 'Universidade Estadual do Norte do Paraná',
        acronym: 'UENP',
        state: 'PR',
        website: 'https://www.uenp.edu.br',
    },
];
const DISCIPLINES = [
    { name: 'Matemática', category: 'Exatas', icon: '🔢', color: '#3b82f6' },
    { name: 'Física', category: 'Exatas', icon: '⚡', color: '#8b5cf6' },
    { name: 'Química', category: 'Exatas', icon: '🧪', color: '#10b981' },
    { name: 'Biologia', category: 'Ciências', icon: '🧬', color: '#22c55e' },
    { name: 'Português', category: 'Linguagens', icon: '📝', color: '#f59e0b' },
    { name: 'Literatura', category: 'Linguagens', icon: '📚', color: '#f97316' },
    { name: 'Inglês', category: 'Linguagens', icon: '🌎', color: '#06b6d4' },
    { name: 'História', category: 'Humanas', icon: '🏛️', color: '#ef4444' },
    { name: 'Geografia', category: 'Humanas', icon: '🌍', color: '#84cc16' },
    { name: 'Atualidades', category: 'Humanas', icon: '📰', color: '#a78bfa' },
];
const ACHIEVEMENTS = [
    {
        code: 'FIRST_QUESTION',
        title: 'Primeiros Passos',
        description: 'Respondeu sua primeira questão',
        icon: '🎯',
        xpReward: 20,
        conditionType: 'questions_answered',
        conditionValue: 1,
    },
    {
        code: 'TEN_QUESTIONS',
        title: 'Começando Bem',
        description: 'Respondeu 10 questões',
        icon: '📝',
        xpReward: 30,
        conditionType: 'questions_answered',
        conditionValue: 10,
    },
    {
        code: 'FIFTY_QUESTIONS',
        title: 'No Ritmo',
        description: 'Respondeu 50 questões',
        icon: '💪',
        xpReward: 60,
        conditionType: 'questions_answered',
        conditionValue: 50,
    },
    {
        code: 'HUNDRED_QUESTIONS',
        title: 'Estudante Dedicado',
        description: 'Respondeu 100 questões',
        icon: '📚',
        xpReward: 100,
        conditionType: 'questions_answered',
        conditionValue: 100,
    },
    {
        code: 'FIVE_HUNDRED_QUESTIONS',
        title: 'Incansável',
        description: 'Respondeu 500 questões',
        icon: '🔑',
        xpReward: 300,
        conditionType: 'questions_answered',
        conditionValue: 500,
    },
    {
        code: 'FIRST_CORRECT',
        title: 'Acertei!',
        description: 'Acertou sua primeira questão',
        icon: '✅',
        xpReward: 15,
        conditionType: 'questions_correct',
        conditionValue: 1,
    },
    {
        code: 'FIFTY_CORRECT',
        title: 'Meio Caminho',
        description: 'Acertou 50 questões',
        icon: '🏹',
        xpReward: 75,
        conditionType: 'questions_correct',
        conditionValue: 50,
    },
    {
        code: 'HUNDRED_CORRECT',
        title: 'Mestre das Questões',
        description: 'Acertou 100 questões',
        icon: '🏆',
        xpReward: 150,
        conditionType: 'questions_correct',
        conditionValue: 100,
    },
    {
        code: 'STREAK_3',
        title: 'Consistente',
        description: 'Estudou 3 dias seguidos',
        icon: '🔥',
        xpReward: 20,
        conditionType: 'streak_days',
        conditionValue: 3,
    },
    {
        code: 'STREAK_7',
        title: 'Semana Completa',
        description: 'Estudou 7 dias seguidos',
        icon: '🔥',
        xpReward: 50,
        conditionType: 'streak_days',
        conditionValue: 7,
    },
    {
        code: 'STREAK_30',
        title: 'Mês de Fogo',
        description: 'Estudou 30 dias seguidos',
        icon: '🔥',
        xpReward: 200,
        conditionType: 'streak_days',
        conditionValue: 30,
    },
    {
        code: 'STREAK_100',
        title: 'Imparável',
        description: 'Estudou 100 dias seguidos',
        icon: '💎',
        xpReward: 500,
        conditionType: 'streak_days',
        conditionValue: 100,
    },
    {
        code: 'FIRST_SIMULATION',
        title: 'Primeiro Simulado',
        description: 'Completou seu primeiro simulado',
        icon: '📋',
        xpReward: 50,
        conditionType: 'simulations_completed',
        conditionValue: 1,
    },
    {
        code: 'TEN_SIMULATIONS',
        title: 'Simulando Muito',
        description: 'Completou 10 simulados',
        icon: '🎓',
        xpReward: 150,
        conditionType: 'simulations_completed',
        conditionValue: 10,
    },
    {
        code: 'SPEEDRUNNER',
        title: 'Velocista',
        description: 'Respondeu 50 questões em um único dia',
        icon: '⚡',
        xpReward: 100,
        conditionType: 'daily_questions',
        conditionValue: 50,
    },
];
async function main() {
    console.log('🌱 Iniciando seed do VestibularPR...\n');
    console.log('📌 Criando universidades...');
    const universityMap = {};
    for (const uni of UNIVERSITIES) {
        const created = await prisma.university.upsert({
            where: { acronym: uni.acronym },
            update: uni,
            create: uni,
        });
        universityMap[uni.acronym] = created.id;
        console.log(`   ✓ ${uni.acronym} — ${uni.name}`);
    }
    console.log('\n📌 Criando disciplinas...');
    const disciplineMap = {};
    for (const disc of DISCIPLINES) {
        const created = await prisma.discipline.upsert({
            where: { name: disc.name },
            update: disc,
            create: disc,
        });
        disciplineMap[disc.name] = created.id;
        console.log(`   ✓ ${disc.icon} ${disc.name}`);
    }
    console.log('\n📌 Criando conquistas...');
    for (const achievement of ACHIEVEMENTS) {
        await prisma.achievement.upsert({
            where: { code: achievement.code },
            update: achievement,
            create: achievement,
        });
    }
    console.log(`   ✓ ${ACHIEVEMENTS.length} conquistas criadas`);
    console.log('\n📌 Criando questões de exemplo...');
    const ufprId = universityMap['UFPR'];
    const matId = disciplineMap['Matemática'];
    const fisId = disciplineMap['Física'];
    const portId = disciplineMap['Português'];
    const bioId = disciplineMap['Biologia'];
    const sampleQuestions = [
        {
            universityId: ufprId,
            disciplineId: matId,
            year: 2023,
            source: 'Vestibular UFPR 2023 — 1ª Fase',
            difficulty: client_1.Difficulty.FACIL,
            questionType: client_1.QuestionType.MULTIPLA_ESCOLHA,
            statement: 'Uma sequência aritmética tem primeiro termo a₁ = 3 e razão r = 4. Qual é o valor do 10º termo desta sequência?',
            alternatives: [
                { id: 'A', text: '35' },
                { id: 'B', text: '39' },
                { id: 'C', text: '43' },
                { id: 'D', text: '47' },
                { id: 'E', text: '51' },
            ],
            correctAnswer: 'B',
            explanation: 'Usando a fórmula do termo geral: aₙ = a₁ + (n-1)·r = 3 + (10-1)·4 = 3 + 36 = 39. Portanto, o 10º termo é 39.',
            tags: ['progressão aritmética', 'termo geral', 'PA'],
        },
        {
            universityId: ufprId,
            disciplineId: matId,
            year: 2023,
            source: 'Vestibular UFPR 2023 — 1ª Fase',
            difficulty: client_1.Difficulty.MEDIO,
            questionType: client_1.QuestionType.MULTIPLA_ESCOLHA,
            statement: 'Uma função quadrática f(x) = x² - 6x + 8 possui raízes reais x₁ e x₂. Qual é o valor de x₁² + x₂²?',
            alternatives: [
                { id: 'A', text: '12' },
                { id: 'B', text: '18' },
                { id: 'C', text: '20' },
                { id: 'D', text: '24' },
                { id: 'E', text: '28' },
            ],
            correctAnswer: 'C',
            explanation: 'Pelas relações de Girard: x₁ + x₂ = 6 e x₁·x₂ = 8. Portanto, x₁² + x₂² = (x₁+x₂)² - 2·x₁·x₂ = 36 - 16 = 20.',
            tags: ['função quadrática', 'relações de Girard', 'raízes'],
        },
        {
            universityId: ufprId,
            disciplineId: fisId,
            year: 2022,
            source: 'Vestibular UFPR 2022 — 1ª Fase',
            difficulty: client_1.Difficulty.MEDIO,
            questionType: client_1.QuestionType.MULTIPLA_ESCOLHA,
            statement: 'Um corpo de massa 2 kg é lançado verticalmente para cima com velocidade inicial de 20 m/s. Considerando g = 10 m/s², qual é a altura máxima atingida?',
            alternatives: [
                { id: 'A', text: '10 m' },
                { id: 'B', text: '15 m' },
                { id: 'C', text: '20 m' },
                { id: 'D', text: '25 m' },
                { id: 'E', text: '30 m' },
            ],
            correctAnswer: 'C',
            explanation: 'Na altura máxima, a velocidade é zero. Usando v² = v₀² - 2g·h: 0 = 400 - 2·10·h → h = 400/20 = 20 m.',
            tags: ['cinemática', 'lançamento vertical', 'MRUA'],
        },
        {
            universityId: ufprId,
            disciplineId: portId,
            year: 2023,
            source: 'Vestibular UFPR 2023 — 1ª Fase',
            difficulty: client_1.Difficulty.FACIL,
            questionType: client_1.QuestionType.MULTIPLA_ESCOLHA,
            statement: 'Assinale a alternativa em que todas as palavras estão corretamente grafadas conforme o Novo Acordo Ortográfico:',
            alternatives: [
                { id: 'A', text: 'idéia, vôo, assembléia' },
                { id: 'B', text: 'ideia, voo, assembleia' },
                { id: 'C', text: 'idéia, voo, assembleia' },
                { id: 'D', text: 'ideia, vôo, assembleia' },
                { id: 'E', text: 'ideia, voo, assembléia' },
            ],
            correctAnswer: 'B',
            explanation: 'Pelo Novo Acordo Ortográfico, os acentos diferenciais foram eliminados. "Ideia", "voo" e "assembleia" não recebem acento gráfico.',
            tags: ['ortografia', 'acordo ortográfico', 'acento'],
        },
        {
            universityId: ufprId,
            disciplineId: bioId,
            year: 2022,
            source: 'Vestibular UFPR 2022 — 1ª Fase',
            difficulty: client_1.Difficulty.MEDIO,
            questionType: client_1.QuestionType.MULTIPLA_ESCOLHA,
            statement: 'A mitose é o processo de divisão celular responsável pelo crescimento e renovação dos tecidos. Em relação às fases da mitose, assinale a alternativa CORRETA:',
            alternatives: [
                { id: 'A', text: 'Na prófase, os cromossomos se tornam invisíveis ao microscópio óptico.' },
                { id: 'B', text: 'Na metáfase, os cromossomos se alinham na placa equatorial da célula.' },
                { id: 'C', text: 'Na anáfase, a membrana nuclear se reorganiza ao redor dos cromossomos.' },
                { id: 'D', text: 'Na telófase, as cromátides-irmãs se separam e migram para os polos.' },
                { id: 'E', text: 'A citocinese ocorre antes da carioquinese em todos os tipos celulares.' },
            ],
            correctAnswer: 'B',
            explanation: 'Na metáfase, os cromossomos atingem o máximo de condensação e se alinham na placa equatorial (placa metafásica), presos pelos filamentos do fuso mitótico. Isso permite a separação equitativa do material genético nas etapas seguintes.',
            tags: ['mitose', 'divisão celular', 'ciclo celular', 'fases da mitose'],
        },
    ];
    for (const q of sampleQuestions) {
        await prisma.realQuestion.create({ data: q });
    }
    console.log(`   ✓ ${sampleQuestions.length} questões de exemplo criadas`);
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║   ✅ SEED CONCLUÍDO COM SUCESSO!     ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║  Universidades : ${UNIVERSITIES.length}                   ║`);
    console.log(`║  Disciplinas   : ${DISCIPLINES.length}                   ║`);
    console.log(`║  Conquistas    : ${ACHIEVEMENTS.length}                   ║`);
    console.log(`║  Questões seed : ${sampleQuestions.length}                    ║`);
    console.log('╚══════════════════════════════════════╝');
}
main()
    .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map