import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup & Radio', () => {
	it('рендерит группу радиокнопок', () => {
		render(
			<RadioGroup value='apple'>
				<Radio value='apple' label='Яблоко' />
				<Radio value='banana' label='Банан' />
			</RadioGroup>
		);
		expect(screen.getByLabelText('Яблоко')).toBeChecked();
		expect(screen.getByLabelText('Банан')).not.toBeChecked();
	});

	it('вызывает onChange при выборе другой радиокнопки', async () => {
		const handleChange = vi.fn();
		render(
			<RadioGroup value='opt1' onChange={handleChange}>
				<Radio value='opt1' label='Опция 1' />
				<Radio value='opt2' label='Опция 2' />
			</RadioGroup>
		);
		await userEvent.click(screen.getByLabelText('Опция 2'));
		expect(handleChange).toHaveBeenCalledWith('opt2');
	});

	it('не позволяет выбрать заблокированную радиокнопку', async () => {
		const handleChange = vi.fn();
		render(
			<RadioGroup value='opt1' onChange={handleChange}>
				<Radio value='opt1' label='Опция 1' />
				<Radio value='opt2' label='Опция 2' disabled />
			</RadioGroup>
		);
		const radio2 = screen.getByLabelText('Опция 2');
		expect(radio2).toBeDisabled();
		await userEvent.click(radio2);
		expect(handleChange).not.toHaveBeenCalled();
	});
});
