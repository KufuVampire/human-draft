import { useProfile as useProfileStore, useSubscriptions } from '@/store';
import { useProfileAvatar } from './useProfileAvatar';
import { useProfilePoster } from './useProfilePoster';

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
