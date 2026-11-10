import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
	it('рендерит поле с плейсхолдером', () => {
		render(<Textarea placeholder='Опишите проблему' />);
		expect(
			screen.getByPlaceholderText('Опишите проблему')
		).toBeInTheDocument();
	});

	it('принимает ввод текста', async () => {
		const handleInput = vi.fn();
		render(<Textarea placeholder='Ввод' onInput={handleInput} />);
		const textarea = screen.getByPlaceholderText('Ввод');
		await userEvent.type(textarea, 'Первая строка\nВторая строка');
		expect(textarea).toHaveValue('Первая строка\nВторая строка');
		expect(handleInput).toHaveBeenCalled();
	});

	it('устанавливает aria-invalid при ошибке', () => {
		render(<Textarea placeholder='Поле' error='Обязательно к заполнению' />);
		expect(screen.getByPlaceholderText('Поле')).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});

	it('блокирует редактирование при disabled', async () => {
		render(<Textarea placeholder='Блок' disabled />);
		const textarea = screen.getByPlaceholderText('Блок');
		expect(textarea).toBeDisabled();
		await userEvent.type(textarea, 'новое');
		expect(textarea).toHaveValue('');
	});
});
