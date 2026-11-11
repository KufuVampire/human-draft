'use client';

import { editorViewCtx } from '@milkdown/core';
import { useEditor } from '@milkdown/react';
import { useEffect, useState } from 'react';

import { uploadPostImage } from '@/api';
// Прямой путь, а не бочка @/libs: её импортируют серверные страницы, Milkdown им не нужен
import { createPostCrepe } from '@/libs/post-editor';
import { type ProseMirrorNode, convertImageToImageBlock } from '@/utils';

interface Params {
	t: (key: string) => string;
	rawContent?: ProseMirrorNode | null;
}

const uploadImage = async (file: File) => (await uploadPostImage(file)).url;

export const useUpdatePostEditor = ({ t, rawContent }: Params) => {
	const [isContentLoaded, setIsContentLoaded] = useState(false);

	const { loading, get } = useEditor(
		(root: HTMLElement) => createPostCrepe({ root, t, onUpload: uploadImage }),
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
