import { ReactNode } from 'react';

import { fetchMe } from '@/api';
import { ConfirmationChangesModal, Dashboard } from '@/modules';
import { Container, Footer, Header, Main } from '@/shared';

import '@/app/globals.css';

export default async function ContentLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const profile = await fetchMe();
	return (
		<>
			<Header userProfile={profile} />
			<Main>
				<Container className='flex gap-x-4'>
					<Dashboard />
					{children}
				</Container>
			</Main>
			<ConfirmationChangesModal />
			<Footer />
		</>
	);
}
