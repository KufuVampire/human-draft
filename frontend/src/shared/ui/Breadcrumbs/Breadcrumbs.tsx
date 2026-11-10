import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
	HTMLAttributes,
	OlHTMLAttributes,
	PropsWithChildren,
	ReactNode,
} from 'react';

import { cn } from '@/utils';

export const Breadcrumbs = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLElement>) => (
	<nav
		aria-label='Хлебные крошки'
		className={cn('flex items-center text-sm font-text select-none', className)}
		{...props}>
		<ol className='flex items-center gap-1.5 flex-wrap'>{children}</ol>
	</nav>
);

export const BreadcrumbsItem = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLLIElement>) => (
	<li className={cn('inline-flex items-center gap-1.5', className)} {...props}>
		{children}
	</li>
);

export interface BreadcrumbsLinkProps {
	href?: string;
	isCurrent?: boolean;
	className?: string;
	children: ReactNode;
}

export const BreadcrumbsLink = ({
	href,
	isCurrent = false,
	className,
	children,
}: BreadcrumbsLinkProps) => {
	if (isCurrent || !href) {
		return (
			<span
				aria-current={isCurrent ? 'page' : undefined}
				className={cn('font-medium text-foreground', className)}>
				{children}
			</span>
		);
	}

	return (
		<Link
			href={href}
			className={cn(
				'text-placeholder hover:text-accent transition-colors',
				className
			)}>
			{children}
		</Link>
	);
};

export const BreadcrumbsSeparator = ({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) => (
	<span
		aria-hidden='true'
		className={cn('text-placeholder shrink-0', className)}>
		{children || <ChevronRight className='size-3.5' />}
	</span>
);

Breadcrumbs.Item = BreadcrumbsItem;
Breadcrumbs.Link = BreadcrumbsLink;
Breadcrumbs.Separator = BreadcrumbsSeparator;
