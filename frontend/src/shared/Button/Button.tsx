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
		'bg-transparent text-primary border border-primary hover:bg-primary-hover hover:border-primary-hover focus-visible:bg-primary-hover focus-visible:border-primary-hover hover:text-secondary focus-visible:text-primary',
	disabled:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled text-[var(--text-color-main)] cursor-auto',
	clear:
		'outline-0 border-0 bg-transparent hover:text-primary-hover focus-visible:text-primary-hover',
	light:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled hover:text-primary-hover focus-visible:text-primary-hover text-[var(--text-color-main)] cursor-pointer',
};

export const Button = ({
	text,
	children,
	variant = 'primary',
	isLoading = false,
	...props
}: PropsWithChildren<Props>) => {
	return (
		<button
			{...props}
			disabled={isLoading || variant === 'disabled'}
			className={cn(
				'transition-colors cursor-pointer flex items-center justify-center text-center',
				isLoading ? styles['disabled'] : styles[variant],
				props.className
			)}>
			{!isLoading ? text || children : <Loader size='24' borderSize='3' />}
		</button>
	);
};
