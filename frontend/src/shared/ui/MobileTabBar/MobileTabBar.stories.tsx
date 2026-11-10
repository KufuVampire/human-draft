import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Compass, Home, PenTool, User } from 'lucide-react';

import { MobileTabBar } from './MobileTabBar';

const sampleNavItems = [
	{ label: 'Главная', icon: <Home className='size-5' />, href: '/', isActive: true },
	{ label: 'Обзор', icon: <Compass className='size-5' />, href: '/explore' },
	{ label: 'Создать', icon: <PenTool className='size-5' />, href: '/post/create' },
	{
		label: 'Уведомления',
		icon: <Bell className='size-5' />,
		href: '/notifications',
		badge: 3,
	},
	{ label: 'Профиль', icon: <User className='size-5' />, href: '/profile' },
];

const meta: Meta<typeof MobileTabBar> = {
	title: 'UI/Navigation/MobileTabBar',
	component: MobileTabBar,
	tags: ['autodocs'],
	args: {
		items: sampleNavItems,
	},
};

export default meta;
type Story = StoryObj<typeof MobileTabBar>;

export const Default: Story = {};
