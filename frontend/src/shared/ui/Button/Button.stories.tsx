import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
	title: 'UI/Controls/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost', 'danger', 'outline'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		isLoading: { control: 'boolean' },
		disabled: { control: 'boolean' },
		iconOnly: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: 'Кнопка действия',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
		children: 'Вторичная кнопка',
	},
};

export const Ghost: Story = {
	args: {
		variant: 'ghost',
		children: 'Прозрачная',
	},
};

export const Danger: Story = {
	args: {
		variant: 'danger',
		children: 'Удалить',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
		children: 'Контурная',
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
		children: 'Сохранение...',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		children: 'Неактивна',
	},
};

export const IconOnly: Story = {
	args: {
		iconOnly: true,
		'aria-label': 'Поиск',
		children: <Search className='size-4' />,
	},
};
