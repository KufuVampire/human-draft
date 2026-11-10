import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';

const sampleOptions = [
	{ value: 'frontend', label: 'Фронтенд разработка' },
	{ value: 'backend', label: 'Бэкенд архитектура' },
	{ value: 'design', label: 'UI/UX Дизайн' },
	{ value: 'qa', label: 'Тестирование', disabled: true },
];

const meta: Meta<typeof Select> = {
	title: 'UI/Controls/Select',
	component: Select,
	tags: ['autodocs'],
	args: {
		options: sampleOptions,
		placeholder: 'Выберите категорию...',
	},
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithValue: Story = {
	args: {
		value: 'frontend',
	},
};

export const ErrorState: Story = {
	args: {
		error: 'Категория обязательна',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		value: 'backend',
	},
};
