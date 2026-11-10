import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './Avatar';

describe('Avatar', () => {
	it('рендерит изображение при валидном src', () => {
		render(<Avatar src='https://example.com/avatar.jpg' alt='Пользователь' />);
		expect(screen.getByRole('img', { name: 'Пользователь' })).toBeInTheDocument();
	});

	it('рендерит инициалы при отсутствии src', () => {
		render(<Avatar initials='ИИ' />);
		expect(screen.getByText('ИИ')).toBeInTheDocument();
	});

	it('переключается на инициалы при ошибке загрузки изображения', () => {
		render(
			<Avatar
				src='https://example.com/bad-image.jpg'
				alt='Битая ссылка'
				initials='ОШ'
			/>
		);
		const img = screen.getByRole('img');
		fireEvent.error(img);
		expect(screen.getByText('ОШ')).toBeInTheDocument();
	});
});
