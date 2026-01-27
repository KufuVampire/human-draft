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
					['-mt-16 md:-mt-[5.5rem] size-[8rem] md:size-[9.375rem] p-1 md:p-[0.313rem] rounded-full bg-[var(--background-color-card)] z-10 transition-colors']:
						location === 'profile-page',
					['bg-placeholder shrink-0 size-[5.625rem] rounded-lg']:
						location === 'users-page',
					['size-full rounded-full bg-[var(--background-color-card)] transition-colors']:
						location === 'settings-page',
				},
				className
			)}>
			{avatarUrl && (
				<div className='relative size-full overflow-hidden'>
					<Image
						src={avatarUrl}
						alt={`${t('userAvatar')} ${username}`}
						className={cn(
							'object-cover size-full',
							location === 'settings-page' && 'cursor-pointer',
							{
								['rounded-full']:
									location === 'profile-page' || location === 'settings-page',
							}
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
						'uppercase flex items-center justify-center bg-[linear-gradient(45deg,#4792c1,#aa67c2,#ea2047)] text-secondary cursor-default text-7xl size-full rounded-lg',
						{
							['rounded-full']:
								location === 'profile-page' || location === 'settings-page',
						}
					)}>
					{username && username.at(0)}
				</div>
			)}
		</div>
	);
};
