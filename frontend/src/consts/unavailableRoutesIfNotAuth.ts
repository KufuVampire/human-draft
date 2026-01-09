import { routesConfig } from '@/config';

export const UNAVAILABLE_ROUTES_IF_NOT_AUTH = [
	routesConfig.profile,
	routesConfig.settings,
	routesConfig.logout,
];
