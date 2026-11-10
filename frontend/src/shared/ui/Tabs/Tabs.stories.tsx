import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
	title: 'UI/DataDisplay/Tabs',
	component: Tabs,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue='feed' className='max-w-md'>
			<Tabs.List>
				<Tabs.Trigger value='feed'>Лента</Tabs.Trigger>
				<Tabs.Trigger value='popular'>Популярное</Tabs.Trigger>
				<Tabs.Trigger value='subscriptions'>Подписки</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='feed'>
				<p className='text-sm text-foreground p-3 border rounded-xl bg-surface-card'>
					Свежие публикации авторов за сегодня.
				</p>
			</Tabs.Content>
			<Tabs.Content value='popular'>
				<p className='text-sm text-foreground p-3 border rounded-xl bg-surface-card'>
					Топ статей за все время по оценкам читателей.
				</p>
			</Tabs.Content>
			<Tabs.Content value='subscriptions'>
				<p className='text-sm text-foreground p-3 border rounded-xl bg-surface-card'>
					Материалы ваших подписок.
				</p>
			</Tabs.Content>
		</Tabs>
	),
};
