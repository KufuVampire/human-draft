import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
	title: 'UI/Navigation/Breadcrumbs',
	component: Breadcrumbs,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
	render: () => (
		<Breadcrumbs>
			<Breadcrumbs.Item>
				<Breadcrumbs.Link href='/'>Главная</Breadcrumbs.Link>
			</Breadcrumbs.Item>
			<Breadcrumbs.Separator />
			<Breadcrumbs.Item>
				<Breadcrumbs.Link href='/blogs'>Блоги</Breadcrumbs.Link>
			</Breadcrumbs.Item>
			<Breadcrumbs.Separator />
			<Breadcrumbs.Item>
				<Breadcrumbs.Link href='/blogs/frontend' isCurrent>
					Фронтенд и UI Kit
				</Breadcrumbs.Link>
			</Breadcrumbs.Item>
		</Breadcrumbs>
	),
};
