import { useProfilePoster } from './useProfilePoster';
import { useProfile as useProfileStore, useSubscriptions } from '@/store';

export const useProfile = () => {
	const profile = useProfileStore();
	const subscriptions = useSubscriptions();
	const poster = useProfilePoster();

	return {
		...profile,
		...subscriptions,
		...poster,
	};
};
