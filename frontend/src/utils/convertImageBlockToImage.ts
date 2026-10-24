export interface ProseMirrorNode {
	type?: string;
	content?: ProseMirrorNode[];
	[key: string]: unknown;
}

export const convertImageBlockToImage = (doc: ProseMirrorNode): ProseMirrorNode => {
	if (doc.type === 'image-block') {
		return { ...doc, type: 'image' };
	}
	if (Array.isArray(doc.content)) {
		return { ...doc, content: doc.content.map(convertImageBlockToImage) };
	}
	return doc;
};
