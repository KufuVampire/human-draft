import { describe, expect, it } from 'vitest';

import { sanitizeTags } from './sanitizeTags';

describe('sanitizeTags', () => {
	it('возвращает undefined, если tags не переданы', () => {
		expect(sanitizeTags(undefined)).toBeUndefined();
	});

	it('нормализует теги к нижнему регистру и обрезает пробелы', () => {
		const result = sanitizeTags(['  React  ', ' NODEJS ']);
		expect(result).toEqual(['react', 'nodejs']);
	});

	it('дедуплицирует повторяющиеся теги с учетом регистра и пробелов', () => {
		const result = sanitizeTags(['react', 'React', '  REACT  ', 'nest']);
		expect(result).toEqual(['react', 'nest']);
	});

	it('фильтрует пустые теги и теги длиннее 50 символов', () => {
		const longTag = 'a'.repeat(51);
		const validTag = 'a'.repeat(50);
		const result = sanitizeTags(['', '   ', longTag, validTag]);
		expect(result).toEqual([validTag]);
	});

	it('ограничивает количество тегов максимумом в 10 штук', () => {
		const tags = Array.from({ length: 15 }, (_, i) => `tag${i}`);
		const result = sanitizeTags(tags);
		expect(result).toHaveLength(10);
		expect(result).toEqual(tags.slice(0, 10));
	});
});
