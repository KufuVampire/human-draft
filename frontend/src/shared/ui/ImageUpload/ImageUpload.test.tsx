import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ImageUpload } from './ImageUpload';

describe('ImageUpload', () => {
	it('рендерит зону загрузки файлов', () => {
		render(<ImageUpload />);
		expect(
			screen.getByText(/Нажмите или перетащите изображение/i)
		).toBeInTheDocument();
	});

	it('рендерит превью изображения при переданном URL', () => {
		render(<ImageUpload value='https://example.com/test.png' />);
		expect(screen.getByRole('img', { name: 'Превью' })).toBeInTheDocument();
	});

	it('вызывает onChange(null) при клике на кнопку удаления', async () => {
		const handleChange = vi.fn();
		render(
			<ImageUpload
				value='https://example.com/test.png'
				onChange={handleChange}
			/>
		);
		const removeBtn = screen.getByRole('button', {
			name: 'Удалить изображение',
		});
		await userEvent.click(removeBtn);
		expect(handleChange).toHaveBeenCalledWith(null);
	});

	it('показывает сообщение об ошибке', () => {
		render(<ImageUpload error='Превышен лимит' />);
		expect(screen.getByRole('alert')).toHaveTextContent('Превышен лимит');
	});
});
