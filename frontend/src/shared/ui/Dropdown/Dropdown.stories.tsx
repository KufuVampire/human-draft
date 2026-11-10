import type { Meta, StoryObj } from '@storybook/react';
import { Edit, LogOut, Settings, Trash } from 'lucide-react';

import { Button } from '../Button/Button';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
	title: 'UI/Overlays/Dropdown',
	component: Dropdown,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
	render: () => (
		<Dropdown>
			<Dropdown.Trigger>
				<Button variant='secondary'>Действия</Button>
			</Dropdown.Trigger>
			<Dropdown.Content align='start'>
				<Dropdown.Item icon={<Edit className='size-4' />}>
					Редактировать
				</Dropdown.Item>
				<Dropdown.Item icon={<Settings className='size-4' />}>
					Настройки
				</Dropdown.Item>
				<Dropdown.Separator />
				<Dropdown.Item
					variant='danger'
					icon={<Trash className='size-4' />}>
					Удалить запись
				</Dropdown.Item>
			</Dropdown.Content>
		</Dropdown>
	),
};
