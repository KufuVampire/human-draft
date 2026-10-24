export interface ProseMirrorNode {
	type?: string;
	content?: ProseMirrorNode[];
	[key: string]: unknown;
}

export const convertImageToImageBlock = (doc: ProseMirrorNode): ProseMirrorNode => {
	if (doc.type === 'image') {
		return { ...doc, type: 'image-block' };
	}
	if (Array.isArray(doc.content)) {
		return { ...doc, content: doc.content.map(convertImageToImageBlock) };
	}
	return doc;
};
