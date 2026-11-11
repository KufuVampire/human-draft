import { ReactNode } from 'react';

import { GuestGuard } from '@/guards';
import { AuthTabLinks } from '@/modules';
import { GoToHomeButton } from '@/shared';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<main className='min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-selection'>
			<div className='flex flex-col w-full max-w-md gap-y-5'>
				<GoToHomeButton />
				<AuthTabLinks />
				<GuestGuard>{children}</GuestGuard>
			</div>
		</main>
	);
}
