import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SignInForm } from '@/modules';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('authPages.signIn.metadata');

	return {
		title: t('title'),
		description: t('description'),
	};
}

export default function SignInPage() {
	return <SignInForm />;
}
