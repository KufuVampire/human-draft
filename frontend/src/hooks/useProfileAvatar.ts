'use client';

import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import {
	useChangeProfileAvatarMutation,
	useRemoveProfileAvatarMutation,
} from '@/graphql/generated/output';
import { useModalStore, useProfileStore } from '@/store';

export const useProfileAvatar = () => {
	const profile = useProfileStore((s) => s.profile);
	const updateProfile = useProfileStore((s) => s.updateProfile);
	const openModal = useModalStore((s) => s.openModal);

	const t = useTranslations('profilePage.notifications');

	const cropperUrlRef = useRef<string | null>(null);
	const previewUrlRef = useRef<string | null>(null);
	const prevAvatarRef = useRef<string | null | undefined>(profile?.avatarUrl);

	const [changeAvatar, { loading: isAvatarChanging }] =
		useChangeProfileAvatarMutation({
			onCompleted(data) {
				if (previewUrlRef.current) {
					URL.revokeObjectURL(previewUrlRef.current);
					previewUrlRef.current = null;
				}
				if (data?.changeProfileAvatar?.avatarUrl) {
					updateProfile({ avatarUrl: data.changeProfileAvatar.avatarUrl });
				}
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
				if (previewUrlRef.current) {
					URL.revokeObjectURL(previewUrlRef.current);
					previewUrlRef.current = null;
				}
				updateProfile({ avatarUrl: null });
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
		openModal('confirmationDeletion', {
			type: 'avatar',
			cb: () => {
				removeAvatar();
				updateProfile({ avatarUrl: null });
			},
		});
	};

	const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (cropperUrlRef.current) {
			URL.revokeObjectURL(cropperUrlRef.current);
		}
		const imageUrl = URL.createObjectURL(file);
		cropperUrlRef.current = imageUrl;

		openModal('cropper', {
			image: imageUrl,
			onCropComplete: handleLoadAvatar,
			onClose: () => {
				if (cropperUrlRef.current) {
					URL.revokeObjectURL(cropperUrlRef.current);
					cropperUrlRef.current = null;
				}
			},
		});
		e.target.value = '';
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
		handleChangeAvatar,
	};
};
