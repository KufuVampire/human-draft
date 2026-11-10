import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
	title: 'UI/Controls/Switch',
	component: Switch,
	tags: ['autodocs'],
	argTypes: {
		checked: { control: 'boolean' },
		disabled: { control: 'boolean' },
		label: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
	args: {
		label: 'Уведомления на почту',
	},
};

export const Checked: Story = {
	args: {
		checked: true,
		label: 'Темная тема',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		label: 'Недоступная настройка',
	},
};
