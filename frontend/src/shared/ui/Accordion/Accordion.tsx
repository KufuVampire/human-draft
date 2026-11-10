import { HTMLAttributes, PropsWithChildren, useState } from 'react';

import { AccordionContent } from './AccordionContent';
import { AccordionContext } from './AccordionContext';
import { AccordionItem } from './AccordionItem';
import { AccordionTrigger } from './AccordionTrigger';
import { cn } from '@/utils';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
	type?: 'single' | 'multiple';
	defaultValue?: string | string[];
	value?: string | string[];
	onValueChange?: (value: string[]) => void;
}

export const Accordion = ({
	type = 'single',
	defaultValue,
	value,
	onValueChange,
	className,
	children,
	...props
}: PropsWithChildren<AccordionProps>) => {
	const initialValues = Array.isArray(defaultValue)
		? defaultValue
		: defaultValue
			? [defaultValue]
			: [];
	const [internalValues, setInternalValues] = useState<string[]>(initialValues);

	const isControlled = value !== undefined;
	const currentValues = isControlled
		? Array.isArray(value)
			? value
			: [value]
		: internalValues;

	const toggleItem = (itemValue: string) => {
		let nextValues: string[];
		if (type === 'single') {
			nextValues = currentValues.includes(itemValue) ? [] : [itemValue];
		} else {
			nextValues = currentValues.includes(itemValue)
				? currentValues.filter((v) => v !== itemValue)
				: [...currentValues, itemValue];
		}
		if (!isControlled) {
			setInternalValues(nextValues);
		}
		onValueChange?.(nextValues);
	};

	return (
		<AccordionContext.Provider
			value={{ type, expandedValues: currentValues, toggleItem }}>
			<div
				className={cn(
					'flex flex-col divide-y divide-border-subtle border-y border-border-subtle w-full',
					className
				)}
				{...props}>
				{children}
			</div>
		</AccordionContext.Provider>
	);
};

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
