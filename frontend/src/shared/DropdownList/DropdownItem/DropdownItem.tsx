import { memo, PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const DropdownItem = memo(({
	className,
	children,
}: PropsWithChildren<Props>) => {
	return <li className={cn('w-full', className)}>{children}</li>;
});

DropdownItem.displayName = 'DropdownItem'