import { cva, type VariantProps } from 'class-variance-authority';
import { User } from 'lucide-react';
import { HTMLAttributes, useEffect, useState } from 'react';

import { cn } from '@/utils';

export const avatarVariants = cva(
	'relative inline-flex items-center justify-center rounded-full bg-surface-tag text-foreground select-none overflow-hidden shrink-0 font-medium border border-border-subtle',
	{
		variants: {
			size: {
				sm: 'size-8 text-xs',
				md: 'size-10 text-sm',
				lg: 'size-12 text-base',
				xl: 'size-16 text-lg',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
);

export interface AvatarProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof avatarVariants> {
	src?: string | null;
	alt?: string;
	initials?: string;
}

export const Avatar = ({
	src,
	alt,
	initials,
	size,
	className,
	...props
}: AvatarProps) => {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setHasError(false);
	}, [src]);

	const showImage = Boolean(src && !hasError);

	return (
		<div className={cn(avatarVariants({ size }), className)} {...props}>
			{showImage ? (
				<img
					src={src as string}
					alt={alt || 'Аватар'}
					onError={() => setHasError(true)}
					className='size-full object-cover'
				/>
			) : initials ? (
				<span className='uppercase font-title tracking-wider font-bold text-accent'>
					{initials.slice(0, 2)}
				</span>
			) : (
				<User className='size-1/2 text-placeholder' />
			)}
		</div>
	);
};
