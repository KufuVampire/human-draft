import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
	title: 'UI/Controls/Radio',
	component: RadioGroup,
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
	render: (args) => (
		<RadioGroup {...args} defaultValue='opt1'>
			<Radio value='opt1' label='Опция 1' />
			<Radio value='opt2' label='Опция 2' />
			<Radio value='opt3' label='Опция 3 (отключена)' disabled />
		</RadioGroup>
	),
};

export const DisabledGroup: Story = {
	args: {
		disabled: true,
		value: 'opt1',
	},
	render: (args) => (
		<RadioGroup {...args}>
			<Radio value='opt1' label='Первый' />
			<Radio value='opt2' label='Второй' />
		</RadioGroup>
	),
};
