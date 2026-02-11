import { cn } from '@/utils';

interface Props {
	className?: string;
}

export const Skeleton = ({ className }: Props) => {
	return (
		<div
			className={cn(
				'animate-shine-lines bg-gradient-to-r from-secondary dark:from-placeholder via-gray-300 to-secondary dark:to-placeholder bg-[length:200%_100%]',
				className
			)}
		/>
	);
};
