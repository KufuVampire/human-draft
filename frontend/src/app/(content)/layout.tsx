import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { fetchMe } from '@/api';
import { Dashboard } from '@/modules';
import { Container, Footer, Header, Main } from '@/shared';

import '@/app/globals.css';

export default async function ContentLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const cookie = await cookies();
	const token = cookie.get('token')?.value;
	const profile = await fetchMe(token);

	return (
		<>
			<Header userProfile={profile} />
			<Main>
				<Container className='flex gap-x-4'>
					<Dashboard />
					{children}
				</Container>
			</Main>
			<Footer />
		</>
	);
}
