import { AuthGuard } from '@/guards';
import { CreatePostPage } from '@/screens';

export default function CreatePostWithBlogId() {
	return (
		<AuthGuard>
			<CreatePostPage />
		</AuthGuard>
	);
}
