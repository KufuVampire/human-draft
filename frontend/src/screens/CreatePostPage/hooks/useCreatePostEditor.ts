'use client';

import { useEditor } from '@milkdown/react';

import { uploadPostImage } from '@/api';
// Прямой путь, а не бочка @/libs: её импортируют серверные страницы, Milkdown им не нужен
import { createPostCrepe } from '@/libs/post-editor';

interface Params {
	t: (key: string) => string;
}

const uploadImage = async (file: File) => (await uploadPostImage(file)).url;

export const useCreatePostEditor = ({ t }: Params) => {
	return useEditor(
		(root) => createPostCrepe({ root, t, onUpload: uploadImage }),
		[t]
	);
};
