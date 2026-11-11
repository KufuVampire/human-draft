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
		'bg-primary text-on-primary hover:bg-primary-hover focus-visible:bg-primary-hover',
	secondary:
		'bg-surface-card text-foreground border border-border-subtle hover:bg-surface-tag hover:border-primary/50 focus-visible:bg-surface-tag',
	disabled: 'bg-surface-tag text-muted cursor-auto',
	clear: 'hover:text-primary focus-visible:text-primary',
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
