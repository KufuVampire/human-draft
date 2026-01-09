import { ReactNode } from 'react';

import { AuthTabLinks } from '@/modules';
import { GoToHomeButton } from '@/shared';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<main className='w-screen h-screen flex flex-col items-center justify-center px-2'>
			<div className='flex flex-col w-full max-w-[30rem] gap-y-5'>
				<GoToHomeButton />
				<AuthTabLinks />
				{children}
			</div>
		</main>
	);
}
