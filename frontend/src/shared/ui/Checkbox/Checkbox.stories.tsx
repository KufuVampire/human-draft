import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
	title: 'UI/Controls/Checkbox',
	component: Checkbox,
	tags: ['autodocs'],
	argTypes: {
		checked: { control: 'boolean' },
		indeterminate: { control: 'boolean' },
		disabled: { control: 'boolean' },
		label: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
	args: {
		label: 'Запомнить меня',
	},
};

export const Checked: Story = {
	args: {
		checked: true,
		label: 'Согласен с правилами',
	},
};

export const Indeterminate: Story = {
	args: {
		indeterminate: true,
		label: 'Выбраны некоторые элементы',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		label: 'Недоступная опция',
	},
};
