import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
	title: 'UI/Feedback/Skeleton',
	component: Skeleton,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['text', 'circular', 'rectangular'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
	args: {
		variant: 'text',
		width: '280px',
	},
};

export const Circular: Story = {
	args: {
		variant: 'circular',
		width: 48,
		height: 48,
	},
};

export const Rectangular: Story = {
	args: {
		variant: 'rectangular',
		width: '100%',
		height: 160,
	},
};
