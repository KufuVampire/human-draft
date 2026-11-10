'use client';

import { useTranslations } from 'next-intl';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import { LinkAndButtonVariantType, LinkAndButtonVariants } from '@/types';
import { cn } from '@/utils';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

interface Props extends Omit<AnchorProps, keyof LinkProps> {
	href: LinkProps['href'];
	text?: string;
	variant?: LinkAndButtonVariants;
	isLoading?: boolean;
	onClick?: LinkProps['onClick'];
}

const styles: LinkAndButtonVariantType = {
	primary:
		'bg-primary text-secondary hover:bg-primary-hover focus-visible:bg-primary-hover',
	secondary:
		'bg-transparent text-accent border border-primary hover:bg-primary-hover hover:border-primary-hover focus-visible:bg-primary-hover focus-visible:border-primary-hover hover:text-secondary focus-visible:text-accent',
	disabled:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled text-foreground cursor-auto',
	clear: 'hover:text-accent-hover focus-visible:text-accent-hover',
	light: '',
};

export const CustomLink = ({
	text,
	children,
	variant = 'clear',
	isLoading = false,
	...props
}: PropsWithChildren<Props>) => {
	const t = useTranslations();
	return (
		<Link
			{...props}
			className={cn(
				'transition-colors flex items-center justify-center text-center',
				styles[variant],
				props.className
			)}>
			{!isLoading ? text || children : t('loading')}
		</Link>
	);
};
