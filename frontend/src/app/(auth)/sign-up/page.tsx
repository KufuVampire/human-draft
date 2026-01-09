import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SignUpForm } from '@/modules';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('authPages.signUp.metadata');

	return {
		title: t('title'),
		description: t('description'),
	};
}

export default function SignUpPage() {
	return <SignUpForm />;
}
