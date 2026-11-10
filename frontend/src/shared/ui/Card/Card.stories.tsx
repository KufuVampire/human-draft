import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button/Button';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
	title: 'UI/DataDisplay/Card',
	component: Card,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
	render: () => (
		<Card className='max-w-md'>
			<Card.Header>
				<Card.Title>Обзор архитектуры React 19</Card.Title>
				<Card.Description>
					Опубликовано 10 ноября 2026 • 5 мин чтения
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>
					Краткое введение в новые возможности React Server Components и хук
					useActionState.
				</p>
			</Card.Content>
			<Card.Footer className='justify-end'>
				<Button size='sm'>Читать далее</Button>
			</Card.Footer>
		</Card>
	),
};

export const Hoverable: Story = {
	render: () => (
		<Card hoverable className='max-w-md'>
			<Card.Header>
				<Card.Title>Интерактивная карточка</Card.Title>
				<Card.Description>Наведите курсор для подсветки границы</Card.Description>
			</Card.Header>
		</Card>
	),
};
