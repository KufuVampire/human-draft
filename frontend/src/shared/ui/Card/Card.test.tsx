import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
	it('рендерит составные части карточки: Header, Title, Content, Footer', () => {
		render(
			<Card>
				<Card.Header>
					<Card.Title>Заголовок статьи</Card.Title>
					<Card.Description>Описание</Card.Description>
				</Card.Header>
				<Card.Content>Основной текст</Card.Content>
				<Card.Footer>Подвал</Card.Footer>
			</Card>
		);
		expect(screen.getByText('Заголовок статьи')).toBeInTheDocument();
		expect(screen.getByText('Описание')).toBeInTheDocument();
		expect(screen.getByText('Основной текст')).toBeInTheDocument();
		expect(screen.getByText('Подвал')).toBeInTheDocument();
	});
});
