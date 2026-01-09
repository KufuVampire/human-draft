'use client';

import { useTranslations } from 'next-intl';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

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
		'bg-transparent text-primary border border-primary hover:bg-primary-hover hover:border-primary-hover focus-visible:bg-primary-hover focus-visible:border-primary-hover',
	disabled:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled text-[var(--text-color-main)] cursor-auto',
	clear:
		'outline-0 border-0 bg-transparent hover:text-primary-hover focus-visible:text-primary-hover',
};

export const Button = ({
	text,
	children,
	variant = 'primary',
	isLoading = false,
	...props
}: PropsWithChildren<Props>) => {
	const t = useTranslations();

	return (
		<button
			{...props}
			disabled={isLoading}
			className={cn(
				'transition-colors cursor-pointer flex items-center justify-center',
				styles[variant],
				props.className
			)}>
			{!isLoading ? text || children : t('loading')}
		</button>
	);
};
