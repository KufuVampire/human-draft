import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
	title: 'UI/Feedback/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		variant: {
			control: 'select',
			options: ['primary', 'accent', 'current'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Medium: Story = {
	args: {
		size: 'md',
	},
};

export const Small: Story = {
	args: {
		size: 'sm',
	},
};

export const Large: Story = {
	args: {
		size: 'lg',
	},
};
