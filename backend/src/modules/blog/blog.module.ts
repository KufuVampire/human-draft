import { Module } from '@nestjs/common';

import { PostModule } from '../post/post.module';

import { BlogResolver } from './blog.resolver';
import { BlogService } from './blog.service';

@Module({
	providers: [BlogResolver, BlogService],
	imports: [PostModule],
})
export class BlogModule {}
