import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useVisualViewportInset } from './useVisualViewportInset';

class FakeVisualViewport extends EventTarget {
	height = 800;
	offsetTop = 0;
}

describe('useVisualViewportInset', () => {
	const originalViewport = window.visualViewport;
	const originalInnerHeight = window.innerHeight;
	let viewport: FakeVisualViewport;

	beforeEach(() => {
		viewport = new FakeVisualViewport();
		Object.defineProperty(window, 'visualViewport', { value: viewport, configurable: true });
		Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
	});

	afterEach(() => {
		Object.defineProperty(window, 'visualViewport', { value: originalViewport, configurable: true });
		Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, configurable: true });
	});

	it('без клавиатуры отступ нулевой', () => {
		const { result } = renderHook(() => useVisualViewportInset());
		expect(result.current).toBe(0);
	});

	it('при открытии клавиатуры возвращает высоту перекрытой части', () => {
		const { result } = renderHook(() => useVisualViewportInset());

		act(() => {
			viewport.height = 500;
			viewport.dispatchEvent(new Event('resize'));
		});

		expect(result.current).toBe(300);
	});

	it('учитывает прокрутку видимой области (offsetTop в iOS Safari)', () => {
		const { result } = renderHook(() => useVisualViewportInset());

		act(() => {
			viewport.height = 500;
			viewport.offsetTop = 120;
			viewport.dispatchEvent(new Event('scroll'));
		});

		expect(result.current).toBe(180);
	});

	it('без visualViewport отступ нулевой', () => {
		Object.defineProperty(window, 'visualViewport', { value: undefined, configurable: true });
		const { result } = renderHook(() => useVisualViewportInset());
		expect(result.current).toBe(0);
	});
});
