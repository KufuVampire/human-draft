import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Accordion } from './Accordion';

describe('Accordion', () => {
	it('раскрывает и скрывает секцию при клике на триггер', async () => {
		render(
			<Accordion type='single'>
				<Accordion.Item value='q1'>
					<Accordion.Trigger>Вопрос 1</Accordion.Trigger>
					<Accordion.Content>Ответ 1</Accordion.Content>
				</Accordion.Item>
			</Accordion>
		);
		const trigger = screen.getByRole('button', { name: /Вопрос 1/i });
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByText('Ответ 1')).not.toBeInTheDocument();

		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByText('Ответ 1')).toBeInTheDocument();

		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByText('Ответ 1')).not.toBeInTheDocument();
	});
});
