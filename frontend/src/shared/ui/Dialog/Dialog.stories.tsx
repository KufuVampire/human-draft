import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
	title: 'UI/Overlays/Dialog',
	component: Dialog,
	tags: ['autodocs'],
	args: {
		isOpen: true,
		title: 'Редактирование профиля',
		description: 'Внесите необходимые изменения и сохраните их',
		children: (
			<div className='flex flex-col gap-4'>
				<p className='text-sm text-foreground'>
					Здесь располагается содержимое модального окна.
				</p>
				<div className='flex justify-end gap-2'>
					<Button variant='secondary'>Отмена</Button>
					<Button variant='primary'>Сохранить</Button>
				</div>
			</div>
		),
	},
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {};
