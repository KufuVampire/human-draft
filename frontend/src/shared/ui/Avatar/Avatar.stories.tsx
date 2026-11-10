import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
	title: 'UI/DataDisplay/Avatar',
	component: Avatar,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
	args: {
		src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
		alt: 'Анна Смирнова',
	},
};

export const WithInitials: Story = {
	args: {
		initials: 'АС',
	},
};

export const FallbackIcon: Story = {
	args: {},
};

export const Large: Story = {
	args: {
		size: 'xl',
		initials: 'HD',
	},
};
