'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import Cropper from 'react-easy-crop';

import { useClickOutside, useProfileAvatar } from '@/hooks';
import { Button, Modal } from '@/shared';

export const CropperModal = () => {
	const t = useTranslations();
	const {
		isCropperOpen,
		avatarImage,
		zoom,
		setZoom,
		crop,
		setCrop,
		setCroppedAreaPixels,
		setCloseCropper,
		handleSaveCroppedAvatar,
	} = useProfileAvatar();
	const cropperModalRef = useRef<HTMLDivElement>(null);

	useClickOutside(cropperModalRef, setCloseCropper);

	return (
		<Modal isOpen={isCropperOpen}>
			<div
				ref={cropperModalRef}
				className='flex flex-col bg-[var(--background-color-card)] px-3 md:px-5 py-6 max-w-112.5 w-full rounded-2xl overflow-hidden gap-y-6'>
				{avatarImage && (
					<div className='relative aspect-square rounded-2xl overflow-hidden'>
						<Cropper
							aspect={1}
							image={avatarImage}
							zoom={zoom}
							onZoomChange={setZoom}
							crop={crop}
							onCropChange={setCrop}
							restrictPosition={true}
							showGrid={false}
							onCropComplete={(_, croppedPixels) => {
								setCroppedAreaPixels(croppedPixels);
							}}
						/>
					</div>
				)}

				<div className='flex gap-x-12'>
					<Button
						variant='secondary'
						className='py-3 uppercase tracking-[5%] leading-[110%] rounded-[0.625rem] w-full dark:text-secondary'
						onClick={setCloseCropper}>
						{t('btns.cancel')}
					</Button>
					<Button
						className='py-3 uppercase tracking-[5%] leading-[110%] rounded-[0.625rem] w-full'
						onClick={handleSaveCroppedAvatar}>
						{t('btns.save')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
