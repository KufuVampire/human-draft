import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './Tabs';

describe('Tabs', () => {
	it('рендерит вкладки и отображает активный контент', () => {
		render(
			<Tabs defaultValue='tab1'>
				<Tabs.List>
					<Tabs.Trigger value='tab1'>Вкладка 1</Tabs.Trigger>
					<Tabs.Trigger value='tab2'>Вкладка 2</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value='tab1'>Контент 1</Tabs.Content>
				<Tabs.Content value='tab2'>Контент 2</Tabs.Content>
			</Tabs>
		);
		expect(screen.getByRole('tab', { name: 'Вкладка 1' })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		expect(screen.getByText('Контент 1')).toBeInTheDocument();
		expect(screen.queryByText('Контент 2')).not.toBeInTheDocument();
	});

	it('переключает активную вкладку при клике', async () => {
		const handleChange = vi.fn();
		render(
			<Tabs defaultValue='tab1' onValueChange={handleChange}>
				<Tabs.List>
					<Tabs.Trigger value='tab1'>Вкладка 1</Tabs.Trigger>
					<Tabs.Trigger value='tab2'>Вкладка 2</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value='tab1'>Контент 1</Tabs.Content>
				<Tabs.Content value='tab2'>Контент 2</Tabs.Content>
			</Tabs>
		);
		await userEvent.click(screen.getByRole('tab', { name: 'Вкладка 2' }));
		expect(handleChange).toHaveBeenCalledWith('tab2');
		expect(screen.getByText('Контент 2')).toBeInTheDocument();
		expect(screen.queryByText('Контент 1')).not.toBeInTheDocument();
	});
});
