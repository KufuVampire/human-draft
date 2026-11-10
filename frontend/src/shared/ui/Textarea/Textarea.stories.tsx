import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
	title: 'UI/Controls/Textarea',
	component: Textarea,
	tags: ['autodocs'],
	argTypes: {
		autoResize: { control: 'boolean' },
		disabled: { control: 'boolean' },
		error: { control: 'boolean' },
		placeholder: { control: 'text' },
	},
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
	args: {
		placeholder: 'Напишите комментарий...',
	},
};

export const AutoResize: Story = {
	args: {
		autoResize: true,
		placeholder: 'Поле автоматически растягивается по высоте...',
	},
};

export const ErrorState: Story = {
	args: {
		error: true,
		defaultValue: 'Текст с ошибкой валидации',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		placeholder: 'Поле заблокировано',
	},
};
