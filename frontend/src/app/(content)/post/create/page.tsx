import { AuthGuard } from '@/guards';
import { CreatePostPage } from '@/screens';

export default function CreatePost() {
	return (
		<AuthGuard>
			<CreatePostPage />
		</AuthGuard>
	);
}
