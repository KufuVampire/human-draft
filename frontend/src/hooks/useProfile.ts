import { useProfileStore, useSubscriptions } from '@/store';

export const useProfile = () => {
	const profile = useProfileStore();
	const subscriptions = useSubscriptions();

	return {
		...profile,
		...subscriptions,
	};
};
