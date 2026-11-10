interface ContentNode {
	type?: string;
	attrs?: { src?: string; [key: string]: unknown };
	content?: ContentNode[];
	[key: string]: unknown;
}

export interface KeyExtractor {
	extractKey(urlOrKey: string): string;
}

export function extractMediaKeysFromContent(
	content: unknown,
	storage: KeyExtractor
): string[] {
	if (!content) return [];

	let parsedContent: unknown = content;
	if (typeof content === 'string') {
		try {
			parsedContent = JSON.parse(content);
		} catch {
			// Not valid JSON, keep as is
		}
	}

	const urls: string[] = [];

	const walk = (node: unknown) => {
		if (!node || typeof node !== 'object') return;

		const contentNode = node as ContentNode;
		if (
			contentNode.type === 'image' &&
			typeof contentNode.attrs?.src === 'string'
		) {
			urls.push(contentNode.attrs.src);
		}

		if (Array.isArray(contentNode.content)) {
			for (const child of contentNode.content) {
				walk(child);
			}
		}
	};

	if (Array.isArray(parsedContent)) {
		for (const item of parsedContent) {
			walk(item);
		}
	} else if (parsedContent && typeof parsedContent === 'object') {
		walk(parsedContent);
	}

	const keys = urls
		.map((url) => storage.extractKey(url))
		.filter((key): key is string => Boolean(key));

	return Array.from(new Set(keys));
}
