import { normalizeTagName } from './normalizeTagName';

export function sanitizeTags(tags?: string[]): string[] | undefined {
	if (!tags) {
		return undefined;
	}

	return [
		...new Set(
			tags
				.map((tag) => normalizeTagName(tag))
				.filter((tag) => tag.length > 0 && tag.length <= 50)
		),
	].slice(0, 10);
}
