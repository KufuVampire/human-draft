import {
	cloneElement,
	HTMLAttributes,
	isValidElement,
	ReactElement,
	ReactNode,
	useId,
} from 'react';

import { cn } from '@/utils';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
	label?: ReactNode;
	error?: ReactNode;
	helperText?: ReactNode;
	required?: boolean;
	id?: string;
	children: ReactNode;
}

export const FormField = ({
	label,
	error,
	helperText,
	required = false,
	id,
	className,
	children,
	...props
}: FormFieldProps) => {
	const generatedId = useId();
	const fieldId = id || generatedId;
	const errorId = `${fieldId}-error`;
	const helperId = `${fieldId}-helper`;

	const describedBy = [
		error ? errorId : null,
		helperText ? helperId : null,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
			{label && (
				<label
					htmlFor={fieldId}
					className='text-sm font-medium font-text text-foreground flex items-center gap-1 select-none'>
					{label}
					{required && <span className='text-error'>*</span>}
				</label>
			)}
			{isValidElement(children)
				? cloneElement(
						children as ReactElement<{
							id?: string;
							error?: boolean;
							'aria-describedby'?: string;
						}>,
						{
							id: fieldId,
							error: Boolean(error),
							'aria-describedby': describedBy || undefined,
						}
					)
				: children}
			{error ? (
				<p
					id={errorId}
					role='alert'
					className='text-xs text-error font-text mt-0.5'>
					{error}
				</p>
			) : helperText ? (
				<p
					id={helperId}
					className='text-xs text-placeholder font-text mt-0.5'>
					{helperText}
				</p>
			) : null}
		</div>
	);
};
