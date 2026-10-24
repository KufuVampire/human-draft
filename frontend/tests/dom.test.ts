import { describe, expect, it } from 'vitest';

describe('Общие DOM-тесты (frontend/tests)', () => {
	it('Проверяет базовое окружение jsdom', () => {
		const div = document.createElement('div');
		div.id = 'root-test';
		div.textContent = 'Human Draft';
		document.body.appendChild(div);

		const el = document.getElementById('root-test');
		expect(el).not.toBeNull();
		expect(el?.textContent).toBe('Human Draft');

		document.body.removeChild(div);
	});
});
