import { PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const Main = ({ children, className }: PropsWithChildren<Props>) => {
	return (
		<main className={cn('flex-1 w-full py-6 pt-14 md:pt-16', className)}>
			{children}
		</main>
	);
};
