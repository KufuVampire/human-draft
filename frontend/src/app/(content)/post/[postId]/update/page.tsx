import { AuthGuard } from '@/guards';
import { UpdatePostPage } from '@/screens';

export default function PostUpdate() {
	return (
		<AuthGuard>
			<UpdatePostPage />
		</AuthGuard>
	);
}
