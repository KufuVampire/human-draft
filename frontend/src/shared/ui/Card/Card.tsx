import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	hoverable?: boolean;
}

export const Card = ({
	hoverable = false,
	className,
	children,
	...props
}: PropsWithChildren<CardProps>) => {
	return (
		<div
			className={cn(
				'rounded-card border border-border-subtle bg-surface-card text-foreground transition-colors p-6 shadow-sm',
				hoverable && 'hover:border-primary/50 hover:shadow-primary cursor-pointer',
				className
			)}
			{...props}>
			{children}
		</div>
	);
};

export const CardHeader = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex flex-col gap-1.5 pb-4', className)} {...props}>
		{children}
	</div>
);

export const CardTitle = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLHeadingElement>) => (
	<h3
		className={cn('text-lg font-title font-bold leading-heading', className)}
		{...props}>
		{children}
	</h3>
);

export const CardDescription = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLParagraphElement>) => (
	<p className={cn('text-sm text-placeholder leading-relaxed', className)} {...props}>
		{children}
	</p>
);

export const CardContent = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('py-2 text-sm', className)} {...props}>
		{children}
	</div>
);

export const CardFooter = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex items-center pt-4', className)} {...props}>
		{children}
	</div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
