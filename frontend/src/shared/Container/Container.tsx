import { PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const Container = ({
	className,
	children,
}: PropsWithChildren<Props>) => {
	return (
		<div className={cn('max-w-7xl w-full px-4 md:px-8 mx-auto', className)}>
			{children}
		</div>
	);
};
