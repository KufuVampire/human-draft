'use client';

import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import {
	useChangeProfileAvatarMutation,
	useRemoveProfileAvatarMutation,
} from '@/graphql/generated/output';
import {
	useConfirmationDeletionModal,
	useCropperModal,
	useProfile,
} from '@/store';
import { getCroppedImg } from '@/utils';

export const useProfileAvatar = () => {
	const { profile, updateProfile } = useProfile();
	const { setCb, setOpen, setType } = useConfirmationDeletionModal();
	const {
		isCropperOpen,
		avatarImage,
		zoom,
		crop,
		croppedAreaPixels,
		setZoom,
		setCrop,
		setOpenCropper,
		setCloseCropper,
		setCroppedAreaPixels,
	} = useCropperModal();

	const t = useTranslations('profilePage.notifications');

	const cropperUrlRef = useRef<string | null>(null);
	const previewUrlRef = useRef<string | null>(null);
	const prevAvatarRef = useRef<string | null | undefined>(profile?.avatarUrl);

	const [changeAvatar, { loading: isAvatarChanging }] =
		useChangeProfileAvatarMutation({
			onCompleted() {
				toast.success(t('changeAvatarSuccess'));
			},
			onError(err) {
				console.error(err, 'changeAvatar');
				updateProfile({ avatarUrl: prevAvatarRef.current });
				if (previewUrlRef.current) {
					URL.revokeObjectURL(previewUrlRef.current);
					previewUrlRef.current = null;
				}
				toast.error(t('changeAvatarError'));
			},
		});

	const [removeAvatar, { loading: isAvatarRemoving }] =
		useRemoveProfileAvatarMutation({
			onCompleted() {
				toast.success(t('removeAvatarSuccess'));
			},
			onError(err) {
				console.error(err, 'removeAvatar');
				updateProfile({ avatarUrl: prevAvatarRef.current });
				toast.error(t('removeAvatarError'));
			},
		});

	const handleLoadAvatar = (avatar: File) => {
		prevAvatarRef.current = profile?.avatarUrl;
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
		}
		const avatarUrlFromFile = URL.createObjectURL(avatar);
		previewUrlRef.current = avatarUrlFromFile;
		updateProfile({ avatarUrl: avatarUrlFromFile });

		changeAvatar({
			variables: {
				file: avatar,
			},
		});
	};

	const handleRemoveAvatar = () => {
		prevAvatarRef.current = profile?.avatarUrl;
		setType('avatar');
		setOpen(true);
		setCb(() => {
			removeAvatar();
			updateProfile({ avatarUrl: null });
			setOpen(false);
		});
	};

	const handleCloseCropperModal = () => {
		if (cropperUrlRef.current) {
			URL.revokeObjectURL(cropperUrlRef.current);
			cropperUrlRef.current = null;
		}
		setCloseCropper();
	};

	const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (cropperUrlRef.current) {
			URL.revokeObjectURL(cropperUrlRef.current);
		}
		const imageUrl = URL.createObjectURL(file);
		cropperUrlRef.current = imageUrl;

		setOpenCropper(imageUrl);
		e.target.value = '';
	};

	const handleSaveCroppedAvatar = async () => {
		if (!avatarImage || !croppedAreaPixels) return;

		const croppedBlob = await getCroppedImg(avatarImage, croppedAreaPixels);

		const file = new File([croppedBlob], 'avatar.png', {
			type: 'image/png',
		});

		handleLoadAvatar(file);
		handleCloseCropperModal();
	};

	useEffect(() => {
		return () => {
			if (cropperUrlRef.current) {
				URL.revokeObjectURL(cropperUrlRef.current);
				cropperUrlRef.current = null;
			}
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
				previewUrlRef.current = null;
			}
		};
	}, []);

	return {
		removeAvatar,
		changeAvatar,
		isAvatarRemoving,
		isAvatarChanging,
		handleLoadAvatar,
		handleRemoveAvatar,
		zoom,
		setZoom,
		crop,
		setCrop,
		avatarImage,
		isCropperOpen,
		setCroppedAreaPixels,
		setCloseCropper: handleCloseCropperModal,
		handleChangeAvatar,
		handleSaveCroppedAvatar,
	};
};
