import type { Meta, StoryObj } from '@storybook/react';

import { Separator } from './Separator';

const meta: Meta<typeof Separator> = {
	title: 'UI/DataDisplay/Separator',
	component: Separator,
	tags: ['autodocs'],
	argTypes: {
		orientation: {
			control: 'select',
			options: ['horizontal', 'vertical'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
	render: () => (
		<div className='w-64 flex flex-col gap-2'>
			<p className='text-sm'>Верхний блок</p>
			<Separator />
			<p className='text-sm'>Нижний блок</p>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className='flex items-center h-8 gap-4'>
			<span className='text-sm'>Слева</span>
			<Separator orientation='vertical' />
			<span className='text-sm'>Справа</span>
		</div>
	),
};
