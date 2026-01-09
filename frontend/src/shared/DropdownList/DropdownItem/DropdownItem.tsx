import { PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const DropdownItem = ({
	className,
	children,
}: PropsWithChildren<Props>) => {
	return <li className={cn('w-full', className)}>{children}</li>;
};
