import type { Meta, StoryObj } from '@storybook/react';
import { FileText } from 'lucide-react';

import { Button } from '../Button/Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
	title: 'UI/Feedback/EmptyState',
	component: EmptyState,
	tags: ['autodocs'],
	args: {
		icon: <FileText className='size-8' />,
		title: 'Нет опубликованных постов',
		description:
			'Создайте первую статью прямо сейчас, чтобы привлечь новых подписчиков.',
		action: <Button variant='primary'>Написать статью</Button>,
	},
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithoutAction: Story = {
	args: {
		action: undefined,
		title: 'Ничего не найдено',
		description: 'Попробуйте изменить поисковый запрос или фильтры.',
	},
};
