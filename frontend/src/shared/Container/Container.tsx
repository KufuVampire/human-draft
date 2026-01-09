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
		<div className={cn('max-w-[75rem] w-full px-2.5 md:px-10 mx-auto', className)}>
			{children}
		</div>
	);
};
