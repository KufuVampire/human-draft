import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Input } from '../Input/Input';
import { FormField } from './FormField';

describe('FormField', () => {
	it('рендерит лейбл и связывает его с инпутом', () => {
		render(
			<FormField label='Email'>
				<Input placeholder='test@mail.com' />
			</FormField>
		);
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
	});

	it('отображает текст ошибки с role="alert"', () => {
		render(
			<FormField label='Пароль' error='Слишком короткий пароль'>
				<Input type='password' />
			</FormField>
		);
		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent('Слишком короткий пароль');
	});

	it('отображает звездочку обязательного поля при required', () => {
		render(
			<FormField label='Фамилия' required>
				<Input />
			</FormField>
		);
		expect(screen.getByText('*')).toBeInTheDocument();
	});
});
