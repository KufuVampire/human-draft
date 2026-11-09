import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBlobUrl } from './useBlobUrl';

describe('useBlobUrl', () => {
	const originalCreateObjectURL = URL.createObjectURL;
	const originalRevokeObjectURL = URL.revokeObjectURL;

	beforeEach(() => {
		URL.createObjectURL = vi.fn((file: Blob) => `blob:mock-url-${file.size}`);
		URL.revokeObjectURL = vi.fn();
	});

	afterEach(() => {
		URL.createObjectURL = originalCreateObjectURL;
		URL.revokeObjectURL = originalRevokeObjectURL;
		vi.clearAllMocks();
	});

	it('возвращает null, если файл не передан', () => {
		const { result } = renderHook(() => useBlobUrl(null));
		expect(result.current).toBeNull();
		expect(URL.createObjectURL).not.toHaveBeenCalled();
	});

	it('создает и возвращает blob URL при передаче файла', () => {
		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const { result } = renderHook(() => useBlobUrl(file));

		expect(URL.createObjectURL).toHaveBeenCalledWith(file);
		expect(result.current).toBe('blob:mock-url-7');
	});

	it('отзывает предыдущий URL при изменении файла', () => {
		const file1 = new File(['file1'], 'file1.png', { type: 'image/png' });
		const file2 = new File(['file22'], 'file2.png', { type: 'image/png' });

		const { rerender } = renderHook(({ file }) => useBlobUrl(file), {
			initialProps: { file: file1 as File | null },
		});

		expect(URL.createObjectURL).toHaveBeenCalledWith(file1);

		rerender({ file: file2 });

		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url-5');
		expect(URL.createObjectURL).toHaveBeenCalledWith(file2);
	});

	it('отзывает URL при размонтировании компонента', () => {
		const file = new File(['content'], 'test.png', { type: 'image/png' });
		const { unmount } = renderHook(() => useBlobUrl(file));

		expect(URL.revokeObjectURL).not.toHaveBeenCalled();

		unmount();

		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url-7');
	});
});
