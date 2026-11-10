import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
	title: 'UI/Feedback/Badge',
	component: Badge,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: [
				'default',
				'primary',
				'success',
				'warning',
				'error',
				'outline',
			],
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		children: 'Черновик',
	},
};

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: 'Опубликовано',
	},
};

export const Success: Story = {
	args: {
		variant: 'success',
		children: 'Успешно',
	},
};

export const Warning: Story = {
	args: {
		variant: 'warning',
		children: 'На модерации',
	},
};

export const Error: Story = {
	args: {
		variant: 'error',
		children: 'Отклонено',
	},
};

export const Removable: Story = {
	args: {
		variant: 'primary',
		children: 'React 19',
		onRemove: () => alert('Removed'),
	},
};
