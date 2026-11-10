import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../Input/Input';
import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
	title: 'UI/Controls/FormField',
	component: FormField,
	tags: ['autodocs'],
	args: {
		label: 'Имя пользователя',
		children: <Input placeholder='ivan_ivanov' />,
	},
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
	args: {
		helperText: 'Используйте латинские буквы и цифры',
	},
};

export const Required: Story = {
	args: {
		required: true,
		helperText: 'Обязательное поле',
	},
};

export const WithError: Story = {
	args: {
		error: 'Имя пользователя уже занято',
	},
};
