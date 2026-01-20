import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
	useChangeProfilePosterMutation,
	useRemoveProfilePosterMutation,
} from '@/graphql/generated/output';
import { useProfile } from '@/store';

export const useProfilePoster = () => {
	const { profile } = useProfile();
	const [poster, setPoster] = useState<File | string | null>(null);
	const t = useTranslations('profilePage.notifications');
	const [removePosterMutation, { loading: removePosterLoading }] =
		useRemoveProfilePosterMutation({
			onCompleted(data) {
				if (data.removeProfilePoster) {
					toast.success(t('removePosterSuccess'));
				}
			},
			onError(err) {
				console.error(err, 'removePoster');
			},
		});
	const [changePosterMutation, { loading: changePosterLoading }] =
		useChangeProfilePosterMutation({
			onCompleted(data) {
				if (data.changeProfilePoster) {
					setPoster(data.changeProfilePoster.posterUrl || null);
					toast.success(t('changePosterSuccess'));
				}
			},
			onError(err) {
				console.error(err, 'changePoster');
			},
			fetchPolicy: 'network-only',
		});

	const handleLoadPoster = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPoster(file);
		changePosterMutation({
			variables: {
				file,
			},
		});
	};

	const handleRemovePoster = () => {
		removePosterMutation();
		setPoster(null);
	};

	useEffect(() => {
		if (profile?.posterUrl) {
			setPoster(profile.posterUrl);
		}
	}, [profile]);

	return {
		removePosterMutation,
		changePosterMutation,
		removePosterLoading,
		changePosterLoading,
		poster,
		handleLoadPoster,
		handleRemovePoster,
	};
};
