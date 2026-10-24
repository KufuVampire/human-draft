import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { CommentModel } from '@/prisma/generated/models';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class CommentsLoader {
  constructor(private prisma: PrismaService) {}

  public readonly batchReplies = new DataLoader<string, CommentModel[]>(
    async (parentIds: readonly string[]) => {
      const comments = await this.prisma.comment.findMany({
        where: { parentId: { in: [...parentIds] } },
        include: { author: true },
      });

      return parentIds.map((id) => 
        comments.filter((comment) => comment.parentId === id)
      );
    },
  );
}
