import { ReactNode } from 'react';

import {
	ConfirmationChangesModal,
	ConfirmationDeletionModal,
	CropperModal,
	Dashboard,
} from '@/modules';
import { Container, Footer, Header, Main } from '@/shared';

import '@/app/globals.css';

export default function ContentLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<>
			<Header />
			<Main>
				<Container className='flex gap-x-4'>
					<Dashboard />
					{children}
				</Container>
			</Main>
			<ConfirmationChangesModal />
			<ConfirmationDeletionModal />
			<CropperModal />
			<Footer />
		</>
	);
}
