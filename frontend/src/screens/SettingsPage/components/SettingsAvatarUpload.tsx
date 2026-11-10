'use client';

import { Camera } from 'lucide-react';
import type { ChangeEvent } from 'react';

import { UserAvatar } from '@/shared';

interface Props {
	avatarUrl?: string | null;
	username?: string;
	onChangeAvatar: (e: ChangeEvent<HTMLInputElement>) => void;
	isAvatarChanging: boolean;
}

export const SettingsAvatarUpload = ({
	avatarUrl,
	username,
	onChangeAvatar,
	isAvatarChanging,
}: Props) => {
	return (
		<label className='relative size-42.5 md:border border-primary rounded-full bg-surface-card transition-colors cursor-pointer md:self-start shrink-0'>
			<input
				type='file'
				className='hidden'
				onChange={onChangeAvatar}
				disabled={isAvatarChanging}
			/>
			<div className='md:border-2 border-secondary bg-[rgba(27,74,90,0.5)] md:bg-primary absolute inset-0 md:top-auto md:left-auto md:bottom-0 md:right-0 rounded-full overflow-hidden p-2 z-10 flex items-center justify-center md:block'>
				<Camera className='size-14 md:size-8 stroke-secondary' />
			</div>
			<UserAvatar
				avatarUrl={avatarUrl}
				username={username}
				location='settings-page'
			/>
		</label>
	);
};
