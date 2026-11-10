'use client';

import { editorViewCtx } from '@milkdown/core';
import { Crepe } from '@milkdown/crepe';
import { useEditor } from '@milkdown/react';
import { useEffect, useState } from 'react';

import { uploadPostImage } from '@/api';
import { type ProseMirrorNode, convertImageToImageBlock } from '@/utils';

interface Params {
	t: (key: string) => string;
	rawContent?: ProseMirrorNode | null;
}

export const useUpdatePostEditor = ({ t, rawContent }: Params) => {
	const [isContentLoaded, setIsContentLoaded] = useState(false);

	const { loading, get } = useEditor(
		(root: HTMLElement) =>
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

	useEffect(() => {
		if (!rawContent || loading || isContentLoaded) return;

		const editor = get();
		if (!editor) return;
		const convertedJson = convertImageToImageBlock(rawContent);
		editor.action((ctx) => {
			const view = ctx.get(editorViewCtx);
			const node = view.state.schema.nodeFromJSON(convertedJson);
			const tr = view.state.tr.replaceWith(
				0,
				view.state.doc.content.size,
				node
			);
			view.dispatch(tr);
		});

		setIsContentLoaded(true);
	}, [rawContent, loading, isContentLoaded, get]);

	return { loading, get };
};
