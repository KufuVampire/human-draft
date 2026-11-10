import { HTMLAttributes, PropsWithChildren } from 'react';

import { useTabs } from './TabsContext';
import { cn } from '@/utils';

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
}

export const TabsContent = ({
	value,
	className,
	children,
	...props
}: PropsWithChildren<TabsContentProps>) => {
	const { value: activeValue } = useTabs();

	if (activeValue !== value) return null;

	return (
		<div
			role='tabpanel'
			className={cn('outline-none animate-in fade-in', className)}
			{...props}>
			{children}
		</div>
	);
};
