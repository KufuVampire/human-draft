import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Lock } from 'lucide-react';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
	title: 'UI/Controls/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		disabled: { control: 'boolean' },
		error: { control: 'boolean' },
		placeholder: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: {
		placeholder: 'Введите текст...',
	},
};

export const WithIconLeft: Story = {
	args: {
		placeholder: 'email@example.com',
		iconLeft: <Mail className='size-4' />,
	},
};

export const WithIconRight: Story = {
	args: {
		type: 'password',
		placeholder: 'Введите пароль',
		iconRight: <Lock className='size-4' />,
	},
};

export const WithPrefix: Story = {
	args: {
		prefixText: 'https://',
		placeholder: 'example.com',
	},
};

export const ErrorState: Story = {
	args: {
		error: true,
		defaultValue: 'Неверный формат',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		placeholder: 'Поле заблокировано',
	},
};
