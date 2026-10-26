import { AuthGuard } from '@/guards';
import { UpdateBlogPage } from '@/screens';

export default function BlogUpdate() {
	return (
		<AuthGuard>
			<UpdateBlogPage />
		</AuthGuard>
	);
}
