import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
	title: 'UI/DataDisplay/Accordion',
	component: Accordion,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
	render: () => (
		<Accordion type='single' defaultValue='faq1' className='max-w-md'>
			<Accordion.Item value='faq1'>
				<Accordion.Trigger>Что такое Human Draft?</Accordion.Trigger>
				<Accordion.Content>
					Human Draft — это современная блог-платформа для авторов и
					читателей с поддержкой Markdown и E2E шифрования.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='faq2'>
				<Accordion.Trigger>Как стать автором?</Accordion.Trigger>
				<Accordion.Content>
					Зарегистрируйтесь на платформе и создайте свой первый блог в личном
					кабинете.
				</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	),
};

export const Multiple: Story = {
	render: () => (
		<Accordion type='multiple' defaultValue={['item1', 'item2']} className='max-w-md'>
			<Accordion.Item value='item1'>
				<Accordion.Trigger>Секция 1</Accordion.Trigger>
				<Accordion.Content>Содержимое первой секции.</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value='item2'>
				<Accordion.Trigger>Секция 2</Accordion.Trigger>
				<Accordion.Content>Содержимое второй секции.</Accordion.Content>
			</Accordion.Item>
		</Accordion>
	),
};
