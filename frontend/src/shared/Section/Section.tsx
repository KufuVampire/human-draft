import { CSSProperties, PropsWithChildren } from 'react';

import { cn } from '@/utils';

interface Props {
	className?: string;
	style?: CSSProperties
}

export const Section = ({ children, className, style }: PropsWithChildren<Props>) => {
	return <section className={cn('py-3 md:py-5', className)} style={style}>{children}</section>;
};
