'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { cn } from '@/utils';

interface Props {
	avatarUrl?: string | null;
	username?: string;
	location?: 'profile-page' | 'users-page' | 'header' | 'burger-menu';
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
				'overflow-hidden',
				{
					['-mt-[5.5rem] size-[9.375rem] p-[0.313rem] rounded-full bg-[var(--background-color-card)] z-30 transition-colors']:
						location === 'profile-page',
					['bg-placeholder shrink-0 size-[5.625rem] rounded-lg']:
						location === 'users-page',
					['rounded-xl']: location === 'header',
					['rounded-sm']: location === 'burger-menu',
				},
				className
			)}>
			{avatarUrl && (
				<div
					className={cn({
						['size-[8.75rem]']: location === 'profile-page',
						['size-[5.625rem]']: location === 'users-page',
						['size-[2.5rem]']: location === 'header',
						['size-6']: location === 'burger-menu',
					})}>
					<Image
						src={avatarUrl}
						alt={`${t('userAvatar')} ${username}`}
						fill
						className='object-cover'
					/>
				</div>
			)}
			{!avatarUrl && (
				<div
					className={cn(
						'uppercase flex items-center justify-center bg-[#dc5c4b] text-secondary cursor-default text-7xl',
						{
							['size-[8.75rem] rounded-full']: location === 'profile-page',
							['size-[5.625rem]']: location === 'users-page',
							['size-[2.5rem] text-2xl']: location === 'header',
							['size-6 text-lg']: location === 'burger-menu',
						}
					)}>
					{username && username.at(0)}
				</div>
			)}
		</div>
	);
};
