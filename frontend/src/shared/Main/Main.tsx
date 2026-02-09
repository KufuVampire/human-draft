import { PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const Main = ({ children, className }: PropsWithChildren<Props>) => {
	return (
		<main
			className={cn(
				'md:min-h-[calc(100dvh-15.75rem)] min-h-[calc(100dvh-20.875rem)] w-full py-5 pt-[5.125rem] md:pt-[6.5rem]',
				className
			)}>
			{children}
		</main>
	);
};
