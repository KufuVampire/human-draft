'use client';

import { Crepe } from '@milkdown/crepe';
import { useEditor } from '@milkdown/react';

import { uploadPostImage } from '@/api';

interface Params {
	t: (key: string) => string;
}

export const useCreatePostEditor = ({ t }: Params) => {
	return useEditor(
		(root) =>
			new Crepe({
				root,
				features: {
					placeholder: true,
					'image-block': true,
				},
				featureConfigs: {
					placeholder: {
						text: t('createPostPage.defaultValue'),
					},
					'code-mirror': {
						copyText: t('createPostPage.copyCode'),
					},
					'image-block': {
						onUpload: async (file) => {
							const data = await uploadPostImage(file);
							return data.url;
						},
					},
				},
			}),
		[t]
	);
};
