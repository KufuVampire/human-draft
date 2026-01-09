import { getRequestConfig } from 'next-intl/server';

import { getCurrentLocale } from './locales';

export default getRequestConfig(async () => {
	const locale = await getCurrentLocale();

	return {
		messages: (await import(`../../../public/languages/${locale}.json`))
			.default,
		locale,
	};
});
