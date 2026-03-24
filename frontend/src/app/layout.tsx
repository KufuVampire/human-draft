import { LazyMotion, domAnimation } from 'motion/react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { Roboto, Ubuntu } from 'next/font/google';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { fetchMe } from '@/api';
import {
	ApolloClientProvider,
	AuthProvider,
	MilkdownProvider,
} from '@/providers';
import { cn } from '@/utils';

import './globals.css';

const ubuntu = Ubuntu({
	variable: '--font-ubuntu',
	subsets: ['latin'],
	fallback: ['system-ui', 'sans-serif'],
	weight: ['300', '400', '700'],
	style: ['normal'],
});
const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin'],
	fallback: ['system-ui', 'sans-serif'],
	weight: ['300', '400', '700'],
	style: ['normal'],
});

export const metadata: Metadata = {
	title: {
		template: '%s | HUMAN DRAFT',
		default: 'HUMAN DRAFT',
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const [locale, messages, user] = await Promise.all([
		getLocale(),
		getMessages(),
		fetchMe(),
	]);

	return (
		<html
			lang={locale}
			suppressHydrationWarning>
			<body className={cn(ubuntu.variable, roboto.variable, 'antialiased')}>
				<ApolloClientProvider>
					<NextIntlClientProvider messages={messages}>
						<ThemeProvider
							attribute='class'
							defaultTheme='light'
							themes={['light', 'dark']}
							enableSystem={false}>
							<AuthProvider user={user} />
							<MilkdownProvider>
								<LazyMotion
									features={domAnimation}
									strict>
									{children}
									<Toaster
										position='bottom-right'
										duration={4999}
										closeButton
									/>
								</LazyMotion>
							</MilkdownProvider>
						</ThemeProvider>
					</NextIntlClientProvider>
				</ApolloClientProvider>
			</body>
		</html>
	);
}
