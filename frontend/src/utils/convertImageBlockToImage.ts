export const convertImageBlockToImage = (doc: any) => {
	if (doc.type === 'image-block') {
		return { ...doc, type: 'image' };
	}
	if (doc.content) {
		return { ...doc, content: doc.content.map(convertImageBlockToImage) };
	}
	return doc;
};
