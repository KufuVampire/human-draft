import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
	useChangeProfilePosterMutation,
	useRemoveProfilePosterMutation,
} from '@/graphql/generated/output';
import { useProfile } from '@/store';

export const useProfilePoster = () => {
	const { setProfile } = useProfile();
	const t = useTranslations('profilePage.notifications');
	const [removePosterMutation, { loading: removePosterLoading }] =
		useRemoveProfilePosterMutation({
			onCompleted(data) {
				if (data.removeProfilePoster) {
					toast.success(t('removePosterSuccess'));
					setProfile(data.removeProfilePoster);
				}
			},
			onError(err) {
				console.error(err);
			},
		});
	const [changePosterMutation, { loading: changePosterLoading }] =
		useChangeProfilePosterMutation({
			onCompleted(data) {
				if (data.changeProfilePoster) {
					toast.success(t('changePosterSuccess'));
					setProfile(data.changeProfilePoster);
				}
			},
			onError(err) {
				console.error(err);
			},
		});

	return {
		removePosterMutation,
		changePosterMutation,
		removePosterLoading,
		changePosterLoading,
	};
};
