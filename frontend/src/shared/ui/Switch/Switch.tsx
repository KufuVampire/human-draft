import { forwardRef, KeyboardEvent, ReactNode, useId } from 'react';

import { cn } from '@/utils';

export interface SwitchProps {
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	label?: ReactNode;
	id?: string;
	className?: string;
	onChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{
			checked = false,
			disabled = false,
			label,
			id,
			className,
			onChange,
			...props
		},
		ref
	) => {
		const generatedId = useId();
		const switchId = id || generatedId;

		const handleToggle = () => {
			if (disabled) return;
			onChange?.(!checked);
		};

		const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				handleToggle();
			}
		};

		return (
			<label
				htmlFor={switchId}
				className={cn(
					'inline-flex items-center gap-3 cursor-pointer select-none text-sm font-text',
					disabled && 'cursor-not-allowed opacity-50',
					className
				)}>
				<button
					ref={ref}
					id={switchId}
					type='button'
					role='switch'
					aria-checked={checked}
					disabled={disabled}
					onClick={handleToggle}
					onKeyDown={handleKeyDown}
					className={cn(
						'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary',
						checked ? 'bg-primary' : 'bg-surface-tag border border-border-subtle',
						disabled && 'cursor-not-allowed'
					)}
					{...props}>
					<span
						className={cn(
							'inline-block size-4 transform rounded-full bg-surface-card shadow-sm transition-transform',
							checked ? 'translate-x-6' : 'translate-x-1'
						)}
					/>
				</button>
				{label && <span className='text-foreground'>{label}</span>}
			</label>
		);
	}
);

Switch.displayName = 'Switch';
