import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
	it('рендерит SVG спиннер с role="status" и aria-label', () => {
		render(<Spinner label='Загрузка контента' />);
		const spinner = screen.getByRole('status', {
			name: 'Загрузка контента',
		});
		expect(spinner).toBeInTheDocument();
	});
});
