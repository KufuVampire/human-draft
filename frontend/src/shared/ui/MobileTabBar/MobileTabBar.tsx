import Link from 'next/link';
import { ReactNode } from 'react';

import { cn } from '@/utils';

export interface MobileTabBarItem {
	label: string;
	icon: ReactNode;
	href: string;
	isActive?: boolean;
	badge?: number | string;
}

export interface MobileTabBarProps {
	items: MobileTabBarItem[];
	onItemClick?: (href: string) => void;
	className?: string;
}

export const MobileTabBar = ({
	items,
	onItemClick,
	className,
}: MobileTabBarProps) => {
	return (
		<nav
			aria-label='Мобильная навигация'
			className={cn(
				'fixed bottom-0 inset-x-0 z-header flex items-center justify-around h-16 bg-surface-card border-t border-border-subtle md:hidden select-none px-2 shadow-primary',
				className
			)}>
			{items.map((item) => {
				const isSelected = Boolean(item.isActive);

				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={() => onItemClick?.(item.href)}
						aria-current={isSelected ? 'page' : undefined}
						className={cn(
							'relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors cursor-pointer outline-none focus-visible:text-accent',
							isSelected
								? 'text-accent font-semibold'
								: 'text-placeholder hover:text-foreground'
						)}>
						<div className='relative flex items-center justify-center'>
							<span className='size-5 shrink-0'>{item.icon}</span>
							{item.badge !== undefined && (
								<span className='absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-error text-secondary text-[10px] font-bold flex items-center justify-center leading-none'>
									{item.badge}
								</span>
							)}
						</div>
						<span className='text-[11px] leading-tight font-text'>
							{item.label}
						</span>
					</Link>
				);
			})}
		</nav>
	);
};
