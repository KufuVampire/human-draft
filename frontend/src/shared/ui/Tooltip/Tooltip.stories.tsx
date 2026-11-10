import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
	title: 'UI/Overlays/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	args: {
		content: 'Подсказка для кнопки',
		placement: 'top',
		children: <Button variant='secondary'>Наведи на меня</Button>,
	},
	argTypes: {
		placement: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
	args: {
		placement: 'top',
	},
};

export const Bottom: Story = {
	args: {
		placement: 'bottom',
	},
};

export const Right: Story = {
	args: {
		placement: 'right',
	},
};
