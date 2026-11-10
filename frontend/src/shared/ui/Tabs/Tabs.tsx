import { HTMLAttributes, PropsWithChildren, useState } from 'react';

import { TabsContent } from './TabsContent';
import { TabsContext } from './TabsContext';
import { TabsList } from './TabsList';
import { TabsTrigger } from './TabsTrigger';
import { cn } from '@/utils';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
}

export const Tabs = ({
	defaultValue,
	value,
	onValueChange,
	className,
	children,
	...props
}: PropsWithChildren<TabsProps>) => {
	const [internalValue, setInternalValue] = useState(defaultValue);

	const isControlled = value !== undefined;
	const activeValue = isControlled ? value : internalValue;

	const handleValueChange = (val: string) => {
		if (!isControlled) {
			setInternalValue(val);
		}
		onValueChange?.(val);
	};

	return (
		<TabsContext.Provider
			value={{ value: activeValue, onValueChange: handleValueChange }}>
			<div className={cn('flex flex-col gap-3 w-full', className)} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
