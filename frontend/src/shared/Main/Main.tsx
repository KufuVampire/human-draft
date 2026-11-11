import { PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const Main = ({ children, className }: PropsWithChildren<Props>) => {
	return (
		<main className={cn('flex-1 w-full py-6 pt-18 md:pt-20', className)}>
			{children}
		</main>
	);
};
