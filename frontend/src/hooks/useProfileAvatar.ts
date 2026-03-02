import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';
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
	const { updateProfile } = useProfile();
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

	const [changeAvatar, { loading: isAvatarChanging }] =
		useChangeProfileAvatarMutation({
			onCompleted() {
				toast.success(t('changeAvatarSuccess'));
			},
			onError(err) {
				console.error(err, 'changeAvatar');
			},
		});
	const [removeAvatar, { loading: isAvatarRemoving }] =
		useRemoveProfileAvatarMutation({
			onCompleted() {
				toast.success(t('removeAvatarSuccess'));
			},
			onError(err) {
				console.error(err, 'removeAvatar');
			},
		});

	const handleLoadAvatar = (avatar: File) => {
		const avatarUrlFromFile = URL.createObjectURL(avatar);
		updateProfile({ avatarUrl: avatarUrlFromFile });

		changeAvatar({
			variables: {
				file: avatar,
			},
		});
	};

	const handleRemoveAvatar = () => {
		setType('avatar');
		setOpen(true);
		setCb(() => {
			removeAvatar();
			updateProfile({ avatarUrl: null });
			setOpen(false);
		});
	};

	const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const imageUrl = URL.createObjectURL(file);

		setOpenCropper(imageUrl);
		e.target.value = ''
	};

	const handleSaveCroppedAvatar = async () => {
		if (!avatarImage || !croppedAreaPixels) return;

		const croppedBlob = await getCroppedImg(avatarImage, croppedAreaPixels);

		const file = new File([croppedBlob], 'avatar.png', {
			type: 'image/png',
		});

		handleLoadAvatar(file);
		setCloseCropper();
	};

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
		setCloseCropper,
		handleChangeAvatar,
		handleSaveCroppedAvatar,
	};
};
