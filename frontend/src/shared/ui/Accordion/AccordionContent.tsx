import { HTMLAttributes, PropsWithChildren } from 'react';

import { useAccordion, useAccordionItem } from './AccordionContext';
import { cn } from '@/utils';

export const AccordionContent = ({
	className,
	children,
	...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
	const { expandedValues } = useAccordion();
	const { value } = useAccordionItem();
	const isExpanded = expandedValues.includes(value);

	if (!isExpanded) return null;

	return (
		<div
			role='region'
			className={cn(
				'pb-4 pt-1 text-sm text-placeholder leading-relaxed animate-in fade-in',
				className
			)}
			{...props}>
			{children}
		</div>
	);
};
