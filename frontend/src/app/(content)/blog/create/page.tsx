import { AuthGuard } from '@/guards';
import { CreateBlogPage } from '@/screens';

export default function CreateBlog() {
	return (
		<AuthGuard>
			<CreateBlogPage />
		</AuthGuard>
	);
}
