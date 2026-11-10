'use client';

import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type MouseEvent, useMemo, useState } from 'react';

import { Button, Dropdown } from '@/shared';

interface Props {
	hasAvatar: boolean;
	hasPoster: boolean;
	isDisabled: boolean;
	onChangeAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onLoadPoster: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onRemoveAvatar: () => void;
	onRemovePoster: () => void;
}

export const ProfileDropdown = ({
	hasAvatar,
	hasPoster,
	isDisabled,
	onChangeAvatar,
	onLoadPoster,
	onRemoveAvatar,
	onRemovePoster,
}: Props) => {
	const t = useTranslations();
	const [isOpen, setOpen] = useState(false);

	const dropdownList = useMemo(() => {
		const inputs = [
			<label
				key='edit-avatar'
				className='text-secondary px-3 rounded-lg leading-6 backdrop-blur-disabled hover:text-accent-hover focus-visible:text-accent-hover cursor-pointer transition-colors w-full text-left'>
				{t('btns.editAvatar')}
				<input
					type='file'
					className='hidden'
					onChange={onChangeAvatar}
					disabled={isDisabled}
				/>
			</label>,
			<label
				key='edit-poster'
				className='text-secondary px-3 rounded-lg leading-6 backdrop-blur-disabled hover:text-accent-hover focus-visible:text-accent-hover cursor-pointer transition-colors w-full text-left'>
				{t('btns.editPoster')}
				<input
					type='file'
					className='hidden'
					onChange={onLoadPoster}
					disabled={isDisabled}
				/>
			</label>,
		];

		if (hasAvatar) {
			inputs.push(
				<Button
					disabled={isDisabled}
					key='remove-avatar'
					variant='clear'
					data-variant='remove-avatar'
					className='rounded-lg px-3 w-full text-left block'>
					{t('btns.removeAvatar')}
				</Button>
			);
		}

		if (hasPoster) {
			inputs.push(
				<Button
					disabled={isDisabled}
					key='remove-poster'
					variant='clear'
					data-variant='remove-poster'
					className='rounded-lg px-3 w-full text-left block'>
					{t('btns.removePoster')}
				</Button>
			);
		}

		return inputs;
	}, [hasAvatar, hasPoster, isDisabled, onChangeAvatar, onLoadPoster, t]);

	const handleClick = (e: MouseEvent<HTMLUListElement>) => {
		const target = e.target as HTMLElement;
		const button = target.closest('button');
		if (!button) return;

		const variant = button.dataset.variant;
		if (variant === 'remove-avatar') {
			onRemoveAvatar();
		} else if (variant === 'remove-poster') {
			onRemovePoster();
		}
	};

	return (
		<div className='flex justify-end absolute top-0 left-0 right-0 w-full p-2 md:py-3 md:px-6'>
			<Dropdown
				isOpen={isOpen}
				setOpen={setOpen}
				items={dropdownList}
				listClassName='bg-disabled py-2 gap-y-2.5'
				displayDirection='top-right'
				onClick={handleClick}>
				<Button
					variant='light'
					className='rounded-lg py-2 px-3 group'
					onClick={() => setOpen((prev) => !prev)}
					title={t('btns.aria.profilePage.dropdown')}>
					<EllipsisVertical className='stroke-secondary group-hover:stroke-primary-hover transition-colors' />
				</Button>
			</Dropdown>
		</div>
	);
};
