import { AuthGuard } from '@/guards';
import { UpdateBlogPage } from '@/screens';

export default function UpdateBlog() {
	return (
		<AuthGuard>
			<UpdateBlogPage />
		</AuthGuard>
	);
}
