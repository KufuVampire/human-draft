import { ComponentPropsWithoutRef, forwardRef } from 'react';

export type LinkProps = ComponentPropsWithoutRef<'a'> & {
	href: string | object;
	external?: boolean;
	as?: string;
	replace?: boolean;
	scroll?: boolean;
	shallow?: boolean;
	passHref?: boolean;
	prefetch?: boolean;
};

const MockNextLink = forwardRef<HTMLAnchorElement, LinkProps>(
	({ href, children, ...props }, ref) => (
		<a
			ref={ref}
			href={typeof href === 'string' ? href : '#'}
			{...props}>
			{children}
		</a>
	)
);

MockNextLink.displayName = 'MockNextLink';

export default MockNextLink;
export { MockNextLink as Link };
