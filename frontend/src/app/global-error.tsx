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
		<html lang='ru'>
			<body className='min-h-screen flex flex-col items-center justify-center p-4 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased font-sans'>
				<div className='flex flex-col items-center justify-center max-w-lg text-center'>
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
						Что-то пошло не так
					</h2>
					<p className='text-sm md:text-base mb-6 text-zinc-500 dark:text-zinc-400'>
						Произошла критическая ошибка приложения. Отладочная Уточка уже пытается разобраться с этим сбоем.
					</p>
					{error.digest && (
						<p className='text-xs mb-6 text-zinc-400 font-mono'>
							Digest: {error.digest}
						</p>
					)}
					<div className='flex flex-wrap gap-4 items-center justify-center'>
						<button
							type='button'
							onClick={() => reset()}
							className='px-5 py-2.5 rounded-xl font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors cursor-pointer'>
							Попробовать снова
						</button>
						<Link
							href='/'
							className='px-5 py-2.5 rounded-xl font-bold text-sm bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:opacity-80 transition-opacity'>
							На главную
						</Link>
					</div>
				</div>
			</body>
		</html>
	);
}
