import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
	it('рендерит инпут с плейсхолдером', () => {
		render(<Input placeholder='Введите логин' />);
		expect(screen.getByPlaceholderText('Введите логин')).toBeInTheDocument();
	});

	it('корректно принимает ввод пользователя', async () => {
		const handleChange = vi.fn();
		render(<Input placeholder='Имя' onChange={handleChange} />);
		const input = screen.getByPlaceholderText('Имя');
		await userEvent.type(input, 'Александр');
		expect(input).toHaveValue('Александр');
		expect(handleChange).toHaveBeenCalled();
	});

	it('устанавливает aria-invalid при наличии ошибки', () => {
		render(<Input placeholder='Email' error='Неверный адрес' />);
		expect(screen.getByPlaceholderText('Email')).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});

	it('блокирует ввод при disabled', async () => {
		render(<Input placeholder='Блок' disabled />);
		const input = screen.getByPlaceholderText('Блок');
		expect(input).toBeDisabled();
		await userEvent.type(input, 'текст');
		expect(input).toHaveValue('');
	});
});
