import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { cn } from '@/utils';

interface Props {
	username?: string;
	avatarUrl?: string | null;
	location?: 'header' | 'burger-menu';
	className?: string;
}

export const UserBadge = ({
	username,
	avatarUrl,
	location,
	className,
}: Props) => {
	const t = useTranslations();

	return (
		<>
			<div
				className={cn(
					'relative',
					{
						['rounded-xl size-[2.5rem] overflow-hidden']: location === 'header',
						['rounded-sm size-6 overflow-hidden ']: location === 'burger-menu',
					},
					className
				)}>
				{avatarUrl && (
					<div className='relative size-full'>
						<Image
							src={avatarUrl}
							alt={`${t('userAvatar')} ${username}`}
							className='object-cover size-full'
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
							'uppercase flex items-center justify-center bg-[linear-gradient(45deg,#4792c1,#aa67c2,#ea2047)] text-secondary cursor-default text-7xl size-full',
							{
								['text-2xl']: location === 'header',
								['text-lg']: location === 'burger-menu',
							}
						)}>
						{username && username.at(0)}
					</div>
				)}
			</div>
			<span
				className={cn('text-lg hover:text-primary-hovers', {
					['text-secondary']: location === 'burger-menu',
				})}>
				{username}
			</span>
		</>
	);
};
