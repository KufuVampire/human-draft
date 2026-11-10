import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
	it('рендерит заглушку с role="status" и aria-hidden="true"', () => {
		const { container } = render(<Skeleton variant='text' />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveAttribute('role', 'status');
		expect(skeleton).toHaveAttribute('aria-hidden', 'true');
	});

	it('применяет кастомные размеры ширины и высоты', () => {
		const { container } = render(<Skeleton width={120} height={40} />);
		const skeleton = container.firstChild as HTMLElement;
		expect(skeleton).toHaveStyle({ width: '120px', height: '40px' });
	});
});
