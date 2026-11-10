import type { Meta, StoryObj } from '@storybook/react';

import { ImageUpload } from './ImageUpload';

const meta: Meta<typeof ImageUpload> = {
	title: 'UI/Controls/ImageUpload',
	component: ImageUpload,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {};

export const WithPreview: Story = {
	args: {
		value: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300',
	},
};

export const WithError: Story = {
	args: {
		error: 'Неподдерживаемый формат файла',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};
