'use client';

import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import {
	useChangeProfilePosterMutation,
	useRemoveProfilePosterMutation,
} from '@/graphql/generated/output';
import { useConfirmationDeletionModal, useProfile } from '@/store';

export const useProfilePoster = () => {
	const { setCb, setType, setOpen } = useConfirmationDeletionModal();
	const { profile, updateProfile } = useProfile();
	const t = useTranslations('profilePage.notifications');

	const previewUrlRef = useRef<string | null>(null);
	const prevPosterRef = useRef<string | null | undefined>(profile?.posterUrl);

	const [removePosterMutation, { loading: removePosterLoading }] =
		useRemoveProfilePosterMutation({
			onCompleted() {
				if (previewUrlRef.current) {
					URL.revokeObjectURL(previewUrlRef.current);
					previewUrlRef.current = null;
				}
				updateProfile({ posterUrl: null });
				toast.success(t('removePosterSuccess'));
			},
			onError(err) {
				console.error(err, 'removePoster');
				updateProfile({ posterUrl: prevPosterRef.current });
				toast.error(t('removePosterError'));
			},
		});

	const [changePosterMutation, { loading: changePosterLoading }] =
		useChangeProfilePosterMutation({
			onCompleted(data) {
				if (previewUrlRef.current) {
					URL.revokeObjectURL(previewUrlRef.current);
					previewUrlRef.current = null;
				}
				if (data?.changeProfilePoster?.posterUrl) {
					updateProfile({ posterUrl: data.changeProfilePoster.posterUrl });
				}
				toast.success(t('changePosterSuccess'));
			},
			onError(err) {
				console.error(err, 'changePoster');
				updateProfile({ posterUrl: prevPosterRef.current });
				if (previewUrlRef.current) {
					URL.revokeObjectURL(previewUrlRef.current);
					previewUrlRef.current = null;
				}
				toast.error(t('changePosterError'));
			},
			fetchPolicy: 'network-only',
		});

	const handleLoadPoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return toast.error(t('changePosterError'));

		prevPosterRef.current = profile?.posterUrl;
		if (previewUrlRef.current) {
			URL.revokeObjectURL(previewUrlRef.current);
		}
		const posterUrlFromFile = URL.createObjectURL(file);
		previewUrlRef.current = posterUrlFromFile;
		updateProfile({ posterUrl: posterUrlFromFile });

		changePosterMutation({
			variables: {
				file,
			},
		});
		e.target.value = '';
	};

	const handleRemovePoster = () => {
		prevPosterRef.current = profile?.posterUrl;
		setType('poster');
		setOpen(true);
		setCb(() => {
			removePosterMutation();
			updateProfile({ posterUrl: null });
			setOpen(false);
		});
	};

	useEffect(() => {
		return () => {
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
				previewUrlRef.current = null;
			}
		};
	}, []);

	return {
		removePosterMutation,
		changePosterMutation,
		removePosterLoading,
		changePosterLoading,
		handleLoadPoster,
		handleRemovePoster,
	};
};
