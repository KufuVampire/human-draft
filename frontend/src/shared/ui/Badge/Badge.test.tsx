import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
	it('рендерит текст бейджа', () => {
		render(<Badge>Новинка</Badge>);
		expect(screen.getByText('Новинка')).toBeInTheDocument();
	});

	it('рендерит кнопку удаления и обрабатывает клик', async () => {
		const handleRemove = vi.fn();
		render(<Badge onRemove={handleRemove}>Тег</Badge>);
		const removeBtn = screen.getByRole('button', { name: 'Удалить' });
		expect(removeBtn).toBeInTheDocument();
		await userEvent.click(removeBtn);
		expect(handleRemove).toHaveBeenCalledTimes(1);
	});
});
