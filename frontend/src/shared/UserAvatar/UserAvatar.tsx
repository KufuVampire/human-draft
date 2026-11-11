'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { cn } from '@/utils';

interface Props {
	avatarUrl?: string | null;
	username?: string;
	location?: 'profile-page' | 'users-page' | 'settings-page';
	className?: string;
}

export const UserAvatar = ({
	username,
	avatarUrl,
	location = 'profile-page',
	className,
}: Props) => {
	const t = useTranslations();

	return (
		<div
			className={cn(
				'relative',
				{
					'-mt-16 md:-mt-20 size-32 md:size-36 p-1 md:p-1.5 rounded-full bg-surface-card z-10 transition-colors':
						location === 'profile-page',
					'bg-surface-tag shrink-0 size-12 sm:size-16 rounded-xl':
						location === 'users-page',
					'size-full rounded-full bg-surface-card transition-colors':
						location === 'settings-page',
				},
				className
			)}>
			{avatarUrl && (
				<div
					className={cn(
						'relative size-full overflow-hidden',
						location === 'users-page' ? 'rounded-xl' : 'rounded-full'
					)}>
					<Image
						src={avatarUrl}
						alt={`${t('userAvatar')} ${username}`}
						className={cn(
							'object-cover size-full',
							location === 'settings-page' && 'cursor-pointer'
						)}
						fill
						sizes='100%'
						loading='eager'
						unoptimized
					/>
				</div>
			)}
			{!avatarUrl && (
				<div
					className={cn(
						'uppercase flex items-center justify-center bg-gradient-to-tr from-primary to-accent text-secondary font-bold cursor-default size-full',
						location === 'profile-page' && 'text-4xl sm:text-5xl rounded-full',
						location === 'settings-page' && 'text-2xl rounded-full',
						location === 'users-page' && 'text-lg sm:text-xl rounded-xl'
					)}>
					{username && username.at(0)}
				</div>
			)}
		</div>
	);
};
