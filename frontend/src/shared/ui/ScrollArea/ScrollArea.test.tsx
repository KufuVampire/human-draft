import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
	it('рендерит контейнер прокрутки с ограничением высоты', () => {
		render(
			<ScrollArea maxHeight={200}>
				<p>Длинный контент</p>
			</ScrollArea>
		);
		const area = screen.getByText('Длинный контент').parentElement;
		expect(area).toHaveStyle({ maxHeight: '200px' });
	});
});
