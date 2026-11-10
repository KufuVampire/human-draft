import type { ReactNode } from 'react';

export function renderHeading(
	level: number,
	key: string,
	children: ReactNode
): ReactNode {
	switch (level) {
		case 1:
			return (
				<h1
					key={key}
					className='font-title font-bold leading-heading-tight text-3xl md:text-4xl mb-4 mt-6 text-foreground'>
					{children}
				</h1>
			);
		case 2:
			return (
				<h2
					key={key}
					className='font-title font-bold leading-heading-tight text-2xl md:text-3xl mb-3 mt-5 text-foreground'>
					{children}
				</h2>
			);
		case 3:
			return (
				<h3
					key={key}
					className='font-title font-bold leading-heading text-xl md:text-2xl mb-2 mt-4 text-foreground'>
					{children}
				</h3>
			);
		case 4:
			return (
				<h4
					key={key}
					className='font-title font-bold text-lg md:text-xl mb-2 mt-3 text-foreground'>
					{children}
				</h4>
			);
		case 5:
			return (
				<h5
					key={key}
					className='font-title font-bold text-base md:text-lg mb-1 mt-2 text-foreground'>
					{children}
				</h5>
			);
		case 6:
		default:
			return (
				<h6
					key={key}
					className='font-title font-bold text-sm md:text-base mb-1 mt-2 text-foreground'>
					{children}
				</h6>
			);
	}
}
