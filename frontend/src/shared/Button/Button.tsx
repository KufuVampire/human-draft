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
		'bg-primary text-on-primary hover:bg-primary-hover focus-visible:bg-primary-hover',
	secondary:
		'bg-surface-card text-foreground border border-border-subtle hover:bg-surface-tag hover:border-primary/50 focus-visible:bg-surface-tag',
	disabled: 'bg-surface-tag text-muted',
	clear:
		'outline-0 border-0 bg-transparent hover:text-primary focus-visible:text-primary disabled:pointer-events-none disabled:opacity-50',
	light:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled hover:text-primary focus-visible:text-primary text-foreground cursor-pointer',
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
