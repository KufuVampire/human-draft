import type { Meta, StoryObj } from '@storybook/react';

import { AlertDialog } from './AlertDialog';

const meta: Meta<typeof AlertDialog> = {
	title: 'UI/Overlays/AlertDialog',
	component: AlertDialog,
	tags: ['autodocs'],
	args: {
		isOpen: true,
		title: 'Удалить публикацию?',
		description:
			'Это действие необратимо. Статья и все прикрепленные комментарии будут безвозвратно удалены.',
		confirmText: 'Да, удалить',
		cancelText: 'Отмена',
		variant: 'danger',
	},
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Danger: Story = {};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};

export const PrimaryAction: Story = {
	args: {
		variant: 'primary',
		title: 'Опубликовать материал?',
		description: 'Статья станет доступна всем читателям блога.',
		confirmText: 'Опубликовать',
	},
};
