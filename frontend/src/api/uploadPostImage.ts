import { gql } from '@apollo/client';

import { UploadImageModel } from '@/graphql/generated/output';
import { apolloClient } from '@/libs';

const UploadMutation = gql`
	mutation UploadImage($image: Upload!) {
		uploadImage(image: $image) {
			url
		}
	}
`;

export async function uploadPostImage(file: File): Promise<UploadImageModel> {
	const { data } = await apolloClient.mutate({
		mutation: UploadMutation,
		variables: { image: file },
	});

	return data.uploadImage;
}
