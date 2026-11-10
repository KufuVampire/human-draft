import type { Meta, StoryObj } from '@storybook/react';

import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
	title: 'UI/Overlays/Drawer',
	component: Drawer,
	tags: ['autodocs'],
	args: {
		isOpen: true,
		title: 'Панель настроек',
		placement: 'bottom',
		children: (
			<div className='flex flex-col gap-3 py-2'>
				<p className='text-sm text-foreground'>
					Контент выезжающей мобильной шторки или боковой панели десктопа.
				</p>
			</div>
		),
	},
	argTypes: {
		placement: {
			control: 'select',
			options: ['bottom', 'right', 'left'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const BottomSheet: Story = {
	args: {
		placement: 'bottom',
	},
};

export const RightSidebar: Story = {
	args: {
		placement: 'right',
	},
};
