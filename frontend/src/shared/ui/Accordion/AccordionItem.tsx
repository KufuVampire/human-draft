import { HTMLAttributes, PropsWithChildren } from 'react';

import { AccordionItemContext } from './AccordionContext';
import { cn } from '@/utils';

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
}

export const AccordionItem = ({
	value,
	className,
	children,
	...props
}: PropsWithChildren<AccordionItemProps>) => {
	return (
		<AccordionItemContext.Provider value={{ value }}>
			<div className={cn('py-1', className)} {...props}>
				{children}
			</div>
		</AccordionItemContext.Provider>
	);
};
