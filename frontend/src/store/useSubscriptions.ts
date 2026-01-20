import { create } from 'zustand';

interface InitialState {
	subscriptions: string[];
	addSubscription: (id: string) => void;
	removeSubscription: (id: string) => void;
	setSubscriptions: (ids: string[]) => void;
}

export const useSubscriptions = create<InitialState>((set, get) => ({
	subscriptions: [],
	addSubscription: (id) => {
		const subscriptionsSet = new Set(get().subscriptions);
		subscriptionsSet.add(id);

		const subscriptions = [...subscriptionsSet];

		set({
			subscriptions,
		});
	},
	removeSubscription: (id) => {
		const subscriptionsSet = new Set(get().subscriptions);
		subscriptionsSet.delete(id);

		const subscriptions = [...subscriptionsSet];

		set({
			subscriptions,
		});
	},
	setSubscriptions: (ids) =>
		set({
			subscriptions: [...ids],
		}),
}));
