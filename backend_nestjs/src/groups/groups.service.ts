import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(maxUsers?: number, searchText?: string) {
    return this.prisma.group.findMany({
      where: {
        maxUsers: {
          lte: maxUsers,
        },
        OR: [
          {
            name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            location: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            subject: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            notes: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        admin: {
          select: {
            name: true,
            id: true,
          },
        },
        joinsGroups: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.group.findFirst({ where: { id } });
  }

  async create(userId: number, dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        ...dto,
        admin: { connect: { id: userId } },
      },
    });
  }

  update(id: number, dto: UpdateGroupDto) {
    return this.prisma.group.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
