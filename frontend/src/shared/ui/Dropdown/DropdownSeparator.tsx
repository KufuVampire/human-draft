import { cn } from '@/utils';

export const DropdownSeparator = ({ className }: { className?: string }) => (
	<div
		role='separator'
		className={cn('my-1 h-px bg-border-subtle', className)}
	/>
);
