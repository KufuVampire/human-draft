export const convertImageToImageBlock = (doc: any) => {
	if (doc.type === 'image') {
		return { ...doc, type: 'image-block' };
	}
	if (doc.content) {
		return { ...doc, content: doc.content.map(convertImageToImageBlock) };
	}
	return doc;
};
