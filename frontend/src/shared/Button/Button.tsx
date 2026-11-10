import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

import { Loader } from '../Loader/Loader';
import { LinkAndButtonVariantType, LinkAndButtonVariants } from '@/types';
import { cn } from '@/utils';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	text?: string;
	variant?: LinkAndButtonVariants;
	isLoading?: boolean;
}

const styles: LinkAndButtonVariantType = {
	primary:
		'bg-primary text-secondary hover:bg-primary-hover focus-visible:bg-primary-hover',
	secondary:
		'bg-transparent text-accent border border-primary hover:bg-primary-hover hover:border-primary-hover focus-visible:bg-primary-hover focus-visible:border-primary-hover hover:text-secondary focus-visible:text-accent dark:text-secondary',
	disabled:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled text-foreground',
	clear:
		'outline-0 border-0 bg-transparent hover:text-accent-hover focus-visible:text-accent-hover disabled:pointer-events-none disabled:opacity-50',
	light:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled hover:text-accent-hover focus-visible:text-accent-hover text-foreground cursor-pointer',
};

export const Button = ({
	text,
	children,
	variant = 'primary',
	isLoading = false,
	disabled,
	...props
}: PropsWithChildren<Props>) => {
	const isDisabled = Boolean(disabled || isLoading || variant === 'disabled');

	return (
		<button
			{...props}
			disabled={isDisabled}
			className={cn(
				'transition-colors flex items-center justify-center text-center',
				isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
				isLoading || (variant !== 'clear' && isDisabled)
					? styles['disabled']
					: styles[variant],
				props.className
			)}>
			{!isLoading ? (
				text || children
			) : (
				<Loader
					size='24'
					borderSize='3'
				/>
			)}
		</button>
	);
};
