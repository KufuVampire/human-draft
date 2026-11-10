import type { Meta, StoryObj } from '@storybook/react';

import { ScrollArea } from './ScrollArea';

const meta: Meta<typeof ScrollArea> = {
	title: 'UI/DataDisplay/ScrollArea',
	component: ScrollArea,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
	render: () => (
		<ScrollArea maxHeight={180} className='p-4 border rounded-xl bg-surface-card max-w-sm'>
			<div className='flex flex-col gap-3'>
				{Array.from({ length: 15 }).map((_, i) => (
					<p key={i} className='text-sm text-foreground'>
						Элемент длинного списка #{i + 1}
					</p>
				))}
			</div>
		</ScrollArea>
	),
};
