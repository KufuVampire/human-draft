import { ReactNode } from 'react';

import {
	ConfirmationChangesModal,
	ConfirmationDeletionModal,
	CropperModal,
	Dashboard,
	NeedAuthModal,
} from '@/modules';
import { Footer, Header } from '@/components/layout';
import { Container, Main } from '@/shared';

export default function ContentLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className='min-h-screen flex flex-col bg-background text-foreground transition-colors'>
			<Header />
			<Main>
				<Container className='flex gap-x-4 flex-1'>
					<Dashboard />
					{children}
				</Container>
			</Main>
			<ConfirmationChangesModal />
			<ConfirmationDeletionModal />
			<CropperModal />
			<NeedAuthModal />
			<Footer />
		</div>
	);
}
