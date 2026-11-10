'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { toast } from 'sonner';

import { useClickOutside } from '@/hooks';
import { Button, Modal } from '@/shared';
import { useModalData, useModalStore } from '@/store';
import { getCroppedImg } from '@/utils';

export const CropperModal = () => {
	const t = useTranslations();
	const activeModal = useModalStore((s) => s.activeModal);
	const modalData = useModalData('cropper');
	const closeModal = useModalStore((s) => s.closeModal);

	const isOpen = activeModal === 'cropper';

	const [zoom, setZoom] = useState(1);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const cropperModalRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => {
		modalData?.onClose?.();
		closeModal();
	}, [closeModal, modalData]);

	useClickOutside(cropperModalRef, handleClose);

	useEffect(() => {
		if (isOpen) {
			setZoom(1);
			setCrop({ x: 0, y: 0 });
			setCroppedAreaPixels(null);
			setIsSaving(false);
		}
	}, [isOpen]);

	const handleSave = async () => {
		if (!modalData?.image || !croppedAreaPixels || isSaving) return;

		setIsSaving(true);
		try {
			const croppedBlob = await getCroppedImg(
				modalData.image,
				croppedAreaPixels
			);

			const file = new File([croppedBlob], 'avatar.png', {
				type: 'image/png',
			});

			modalData.onCropComplete?.(file);
			handleClose();
		} catch (error) {
			console.error(error);
			toast.error(t('profilePage.notifications.changeAvatarError'));
		} finally {
			setIsSaving(false);
		}
	};

	const avatarImage = modalData?.image;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}>
			<div
				ref={cropperModalRef}
				className='flex flex-col bg-surface-card px-3 md:px-5 py-6 max-w-112.5 w-full rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto gap-y-6'>
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
						className='py-3 uppercase tracking-wider leading-heading-tight rounded-card w-full dark:text-secondary'
						disabled={isSaving}
						onClick={handleClose}>
						{t('btns.cancel')}
					</Button>
					<Button
						className='py-3 uppercase tracking-wider leading-heading-tight rounded-card w-full'
						disabled={isSaving}
						onClick={handleSave}>
						{t('btns.save')}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
