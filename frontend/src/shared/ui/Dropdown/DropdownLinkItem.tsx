import Link, { type LinkProps } from 'next/link';
import { AnchorHTMLAttributes, PropsWithChildren, ReactNode } from 'react';

import { useDropdown } from './DropdownContext';
import { cn } from '@/utils';

export interface DropdownLinkItemProps
	extends LinkProps,
		Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
	icon?: ReactNode;
}

/** Пункт меню-ссылка: сохраняет поведение <a> (Ctrl+клик, новая вкладка), закрывает меню при переходе. */
export const DropdownLinkItem = ({
	children,
	className,
	icon,
	onClick,
	...props
}: PropsWithChildren<DropdownLinkItemProps>) => {
	const { close } = useDropdown();

	return (
		<Link
			role='menuitem'
			onClick={(e) => {
				onClick?.(e);
				close();
			}}
			className={cn(
				'w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left transition-colors cursor-pointer select-none outline-none text-foreground hover:bg-surface-tag focus-visible:bg-surface-tag',
				className
			)}
			{...props}>
			{icon && <span className='shrink-0'>{icon}</span>}
			<span className='flex-1'>{children}</span>
		</Link>
	);
};
