import { useGetPostByIdQuery } from "@/graphql/generated/output";
import { milkdownJsonToHtml } from "@/utils";

export const usePost = (postId: string) => {
	const { data, loading } = useGetPostByIdQuery({
			variables: {
				postId,
			},
		});
	
		const post = data?.getPostById;
		const postHtml = milkdownJsonToHtml(post?.content, post?.title);

		return {
			isLoading: loading,
			...post,
			content: postHtml
		}
}