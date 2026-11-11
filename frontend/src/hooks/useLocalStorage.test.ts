import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { useLocalStorage } from './useLocalStorage';

const KEY = 'test-key';

describe('useLocalStorage', () => {
	afterEach(() => {
		localStorage.clear();
	});

	it('первый рендер отдаёт начальное значение, даже если в хранилище есть сохранённое', () => {
		localStorage.setItem(KEY, JSON.stringify(['сохранено']));
		const Probe = () => {
			const [value] = useLocalStorage<string[]>(KEY, []);
			return createElement('span', null, value.join(','));
		};

		expect(renderToString(createElement(Probe))).toBe('<span></span>');
	});

	it('после монтирования читает сохранённое значение', () => {
		localStorage.setItem(KEY, JSON.stringify(['сохранено']));
		const { result } = renderHook(() => useLocalStorage<string[]>(KEY, []));

		expect(result.current[0]).toEqual(['сохранено']);
	});

	it('не затирает сохранённое значение начальным при монтировании', () => {
		localStorage.setItem(KEY, JSON.stringify(['сохранено']));
		renderHook(() => useLocalStorage<string[]>(KEY, []));

		expect(localStorage.getItem(KEY)).toBe(JSON.stringify(['сохранено']));
	});

	it('сохраняет новое значение в хранилище', () => {
		const { result } = renderHook(() => useLocalStorage<string[]>(KEY, []));

		act(() => result.current[1](['новое']));

		expect(result.current[0]).toEqual(['новое']);
		expect(localStorage.getItem(KEY)).toBe(JSON.stringify(['новое']));
	});

	it('функция-обновление получает текущее значение', () => {
		localStorage.setItem(KEY, JSON.stringify(['первое']));
		const { result } = renderHook(() => useLocalStorage<string[]>(KEY, []));

		act(() => result.current[1]((prev) => [...prev, 'второе']));

		expect(result.current[0]).toEqual(['первое', 'второе']);
	});

	it('при битом JSON в хранилище остаётся начальное значение', () => {
		localStorage.setItem(KEY, '{битый');
		const { result } = renderHook(() => useLocalStorage<string[]>(KEY, ['по умолчанию']));

		expect(result.current[0]).toEqual(['по умолчанию']);
	});
});
