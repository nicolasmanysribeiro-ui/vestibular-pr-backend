import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        xp: true,
        level: true,
        streakDays: true,
        hasCompletedLeveling: true,
        selectedUniversityId: true,
        selectedUniversity: {
          select: { id: true, name: true, acronym: true },
        },
        createdAt: true,
      },
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });
  }

  async selectUniversity(userId: string, universityId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { selectedUniversityId: universityId },
      select: {
        id: true,
        selectedUniversityId: true,
        selectedUniversity: {
          select: { name: true, acronym: true },
        },
      },
    });
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Conta deletada com sucesso' };
  }
}