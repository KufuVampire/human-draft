import { useProfileAvatar, useProfilePoster } from '@/hooks';
import { useProfile as useProfileStore, useSubscriptions } from '@/store';

export const useProfile = () => {
	const profile = useProfileStore();
	const subscriptions = useSubscriptions();
	const poster = useProfilePoster();
	const avatar = useProfileAvatar();

	return {
		...profile,
		...subscriptions,
		...poster,
		...avatar,
	};
};
