import type { Meta, StoryObj } from '@storybook/react';

import { TagInput } from './TagInput';

const meta: Meta<typeof TagInput> = {
	title: 'UI/Controls/TagInput',
	component: TagInput,
	tags: ['autodocs'],
	args: {
		tags: ['frontend', 'react', 'nextjs'],
	},
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {};

export const Empty: Story = {
	args: {
		tags: [],
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
