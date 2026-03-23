import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';

import {
	useChangeProfilePosterMutation,
	useRemoveProfilePosterMutation,
} from '@/graphql/generated/output';
import { useConfirmationDeletionModal, useProfile } from '@/store';

export const useProfilePoster = () => {
	const { setCb, setType, setOpen } = useConfirmationDeletionModal();
	const { updateProfile } = useProfile();
	const t = useTranslations('profilePage.notifications');
	const [removePosterMutation, { loading: removePosterLoading }] =
		useRemoveProfilePosterMutation({
			onCompleted() {
				toast.success(t('removePosterSuccess'));
			},
			onError(err) {
				console.error(err, 'removePoster');
			},
		});	
	const [changePosterMutation, { loading: changePosterLoading }] =
		useChangeProfilePosterMutation({
			onCompleted() {
				toast.success(t('changePosterSuccess'));
			},
			onError(err) {
				console.error(err, 'changePoster');
			},
			fetchPolicy: 'network-only',
		});

	const handleLoadPoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return toast.error(t('changePosterError'));
		const posterUrlFromFile = URL.createObjectURL(file);
		updateProfile({ posterUrl: posterUrlFromFile });
		changePosterMutation({
			variables: {
				file,
			},
		});
		e.target.value = ''
	};

	const handleRemovePoster = () => {
		setType('poster');
		setOpen(true);
		setCb(() => {
			removePosterMutation();
			updateProfile({ posterUrl: null });
			setOpen(false);
		});
	};

	return {
		removePosterMutation,
		changePosterMutation,
		removePosterLoading,
		changePosterLoading,
		handleLoadPoster,
		handleRemovePoster,
	};
};
