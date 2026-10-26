'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

interface Props {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html>
			<body className='min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background-color)] text-[var(--color-primary)] antialiased font-sans'>
				<div className='flex flex-col items-center justify-center max-w-lg text-center bg-[var(--background-color-card)] p-8 rounded-2xl'>
					<h1 className='flex justify-center items-center font-bold mb-4 text-7xl'>
						<span>5</span>
						<Image
							src='/duck.webp'
							alt='duck'
							width={160}
							height={160}
							className='mx-2 w-28 h-28 object-contain'
							priority
						/>
						<span>0</span>
					</h1>
					<h2 className='text-2xl md:text-3xl font-bold mb-3'>
						Что-то пошло не так / Something went wrong
					</h2>
					<p className='text-sm md:text-base mb-6 text-placeholder'>
						Произошла непредвиденная ошибка приложения / An unexpected application error occurred.
					</p>
					{error.digest && (
						<p className='text-xs mb-6 text-placeholder font-mono'>
							Digest: {error.digest}
						</p>
					)}
					<div className='flex flex-wrap gap-4 items-center justify-center'>
						<button
							type='button'
							onClick={() => reset()}
							className='px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--primary-color)] text-[var(--background-color)] hover:opacity-90 transition-opacity cursor-pointer'>
							Попробовать снова / Try again
						</button>
						<Link
							href='/'
							className='px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--background-color-body)] text-[var(--color-primary)] hover:opacity-80 transition-opacity'>
							На главную / Home
						</Link>
					</div>
				</div>
			</body>
		</html>
	);
}
