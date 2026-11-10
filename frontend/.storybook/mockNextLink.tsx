import { ComponentPropsWithoutRef, forwardRef } from 'react';

type MockLinkProps = ComponentPropsWithoutRef<'a'> & {
	href: string | object;
};

const MockNextLink = forwardRef<HTMLAnchorElement, MockLinkProps>(
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
