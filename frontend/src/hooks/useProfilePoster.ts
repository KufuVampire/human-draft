import { useTranslations } from 'next-intl';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';

import {
	useChangeProfilePosterMutation,
	useRemoveProfilePosterMutation,
} from '@/graphql/generated/output';
import { useProfile } from '@/store';

export const useProfilePoster = () => {
	const { setProfile } = useProfile();
	const [poster, setPoster] = useState<File | null>(null);
	const t = useTranslations('profilePage.notifications');
	const [removePosterMutation, { loading: removePosterLoading }] =
		useRemoveProfilePosterMutation({
			onCompleted(data) {
				if (data.removeProfilePoster) {
					setProfile(data.removeProfilePoster);
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
					setProfile(data.changeProfilePoster);
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
