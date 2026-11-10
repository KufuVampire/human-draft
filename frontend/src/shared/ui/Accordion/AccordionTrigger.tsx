import { ChevronDown } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from 'react';

import { useAccordion, useAccordionItem } from './AccordionContext';
import { cn } from '@/utils';

export const AccordionTrigger = forwardRef<
	HTMLButtonElement,
	PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
>(({ children, className, onClick, ...props }, ref) => {
	const { expandedValues, toggleItem } = useAccordion();
	const { value } = useAccordionItem();
	const isExpanded = expandedValues.includes(value);

	return (
		<button
			ref={ref}
			type='button'
			aria-expanded={isExpanded}
			onClick={(e) => {
				onClick?.(e);
				toggleItem(value);
			}}
			className={cn(
				'flex items-center justify-between w-full py-3.5 text-left text-sm font-medium font-text text-foreground hover:text-accent transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg',
				className
			)}
			{...props}>
			<span>{children}</span>
			<ChevronDown
				className={cn(
					'size-4 text-placeholder transition-transform shrink-0 ml-2',
					isExpanded && 'rotate-180 text-primary'
				)}
			/>
		</button>
	);
});

AccordionTrigger.displayName = 'AccordionTrigger';
