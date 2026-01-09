import { PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const Section = ({ children, className }: PropsWithChildren<Props>) => {
	return <section className={cn('py-3 md:py-5', className)}>{children}</section>;
};
