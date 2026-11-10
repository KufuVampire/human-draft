import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
	it('показывает подсказку при наведении мыши (delay=0)', () => {
		render(
			<Tooltip content='Текст подсказки' delay={0}>
				<button type='button'>Кнопка</button>
			</Tooltip>
		);
		const btn = screen.getByRole('button', { name: 'Кнопка' });
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

		fireEvent.mouseEnter(btn);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toBeInTheDocument();
		expect(tooltip).toHaveTextContent('Текст подсказки');

		fireEvent.mouseLeave(btn);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('связывает триггер через aria-describedby при показе', () => {
		render(
			<Tooltip content='Инфо' delay={0}>
				<button type='button'>Фокус</button>
			</Tooltip>
		);
		const btn = screen.getByRole('button');
		fireEvent.focus(btn);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toBeInTheDocument();
		expect(btn.parentElement).toHaveAttribute('aria-describedby', tooltip.id);
	});
});
