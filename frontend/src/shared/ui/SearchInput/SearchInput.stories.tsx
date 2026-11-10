import type { Meta, StoryObj } from '@storybook/react';

import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
	title: 'UI/Controls/SearchInput',
	component: SearchInput,
	tags: ['autodocs'],
	args: {
		placeholder: 'Поиск по статьям и авторам...',
	},
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};

export const WithValue: Story = {
	args: {
		value: 'Next.js 16',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
		value: 'Заблокированный поиск',
	},
};
