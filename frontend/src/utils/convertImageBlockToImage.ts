export const convertImageBlockToImage = (doc: any) => {
	if (doc.type === 'image-block') {
		return { type: 'image', attrs: doc.attrs };
	}
	if (doc.content) {
		return { ...doc, content: doc.content.map(convertImageBlockToImage) };
	}
	return doc;
};
