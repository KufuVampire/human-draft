'use server';

import { cookies } from 'next/headers';

import { COOKIE_NAME, type Locale, defaultLocale } from '@/libs';

export async function getCurrentLocale(): Promise<Locale> {
	const cookiesStore = await cookies();
	const language = cookiesStore.get(COOKIE_NAME)?.value || defaultLocale;
	return language as Locale;
}

export async function setLocale(locale: Locale): Promise<void> {
	const cookiesStore = await cookies();
	cookiesStore.set(COOKIE_NAME, locale);
	return;
}
