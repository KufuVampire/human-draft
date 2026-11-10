import { createContext, HTMLAttributes, useContext } from 'react';

import { cn } from '@/utils';

interface RadioGroupContextType {
	name?: string;
	value?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export const useRadioGroup = () => useContext(RadioGroupContext);

export interface RadioGroupProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	name?: string;
	value?: string;
	defaultValue?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
}

export const RadioGroup = ({
	name,
	value,
	disabled = false,
	onChange,
	className,
	children,
	...props
}: RadioGroupProps) => {
	return (
		<RadioGroupContext.Provider value={{ name, value, disabled, onChange }}>
			<div
				role='radiogroup'
				className={cn('flex flex-col gap-2', className)}
				{...props}>
				{children}
			</div>
		</RadioGroupContext.Provider>
	);
};
