import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
	title: 'UI/Navigation/Pagination',
	component: Pagination,
	tags: ['autodocs'],
	args: {
		currentPage: 3,
		totalPages: 10,
	},
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const FewPages: Story = {
	args: {
		currentPage: 1,
		totalPages: 4,
	},
};

export const LastPage: Story = {
	args: {
		currentPage: 10,
		totalPages: 10,
	},
};
