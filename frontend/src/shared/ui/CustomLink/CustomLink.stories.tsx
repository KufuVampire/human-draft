import type { Meta, StoryObj } from '@storybook/react';

import { CustomLink } from './CustomLink';

const meta: Meta<typeof CustomLink> = {
	title: 'UI/Navigation/CustomLink',
	component: CustomLink,
	tags: ['autodocs'],
	args: {
		href: '/about',
		children: 'Подробнее о проекте',
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'primary', 'muted', 'underlined'],
		},
		external: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof CustomLink>;

export const Default: Story = {};

export const Primary: Story = {
	args: {
		variant: 'primary',
	},
};

export const Muted: Story = {
	args: {
		variant: 'muted',
	},
};

export const External: Story = {
	args: {
		external: true,
		href: 'https://github.com',
		children: 'GitHub репозиторий ↗',
	},
};
