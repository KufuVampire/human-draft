import { milkdownJsonToHtml } from './milkdownJsonToHtml';

export function milkdownPreview(json: any) {
	const firstParagraph = json?.content?.find(
		(node: any) => node.type === 'paragraph'
	);

	if (!firstParagraph) return '';

	return milkdownJsonToHtml({
		...json,
		content: [firstParagraph],
	});
}
