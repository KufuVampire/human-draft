import { cva, type VariantProps } from 'class-variance-authority';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, forwardRef, PropsWithChildren } from 'react';

import { cn } from '@/utils';

export const customLinkVariants = cva(
	'inline-flex items-center gap-1 font-text outline-none transition-colors select-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm',
	{
		variants: {
			variant: {
				default: 'text-foreground hover:text-accent',
				primary:
					'text-accent hover:text-accent-hover font-medium underline-offset-4 hover:underline',
				muted: 'text-placeholder hover:text-foreground',
				underlined:
					'text-accent underline underline-offset-4 hover:text-accent-hover',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface CustomLinkProps
	extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
		LinkProps,
		VariantProps<typeof customLinkVariants> {
	external?: boolean;
}

export const CustomLink = forwardRef<
	HTMLAnchorElement,
	PropsWithChildren<CustomLinkProps>
>(({ href, children, variant, external = false, className, ...props }, ref) => {
	const externalProps = external
		? { target: '_blank', rel: 'noopener noreferrer' }
		: {};

	return (
		<Link
			ref={ref}
			href={href}
			className={cn(customLinkVariants({ variant }), className)}
			{...externalProps}
			{...props}>
			{children}
		</Link>
	);
});

CustomLink.displayName = 'CustomLink';
