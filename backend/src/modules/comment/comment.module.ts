import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentsLoader } from './dataloader/CommentsLoader';

@Module({
  providers: [CommentResolver, CommentService, CommentsLoader],
})
export class CommentModule {}
