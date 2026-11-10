import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from './Separator';

describe('Separator', () => {
	it('рендерит горизонтальный разделитель с правильной ролью', () => {
		render(<Separator />);
		const separator = screen.getByRole('separator');
		expect(separator).toBeInTheDocument();
		expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('рендерит вертикальный разделитель', () => {
		render(<Separator orientation='vertical' />);
		const separator = screen.getByRole('separator');
		expect(separator).toHaveAttribute('aria-orientation', 'vertical');
	});
});
