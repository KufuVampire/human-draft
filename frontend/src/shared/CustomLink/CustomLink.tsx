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
}

const styles: LinkAndButtonVariantType = {
	primary:
		'bg-primary text-secondary hover:bg-primary-hover focus-visible:bg-primary-hover',
	secondary:
		'bg-transparent text-primary border border-primary hover:bg-primary-hover hover:border-primary-hover focus-visible:bg-primary-hover focus-visible:border-primary-hover',
	disabled:
		'bg-disabled hover:bg-disabled backdrop-blur-disabled text-[var(--text-color-main)] cursor-auto',
	clear: 'hover:text-primary-hover focus-visible:text-primary-hover',
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
				'transition-colors flex items-center justify-center',
				styles[variant],
				props.className
			)}>
			{!isLoading ? (text || children) : t('loading')}
		</Link>
	);
};
