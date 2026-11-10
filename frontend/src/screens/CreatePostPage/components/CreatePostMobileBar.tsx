'use client';

import { Button } from '@/shared';

interface Props {
	title?: string;
	fallbackTitle: string;
	buttonText: string;
	isLoading: boolean;
	isValid: boolean;
}

export const CreatePostMobileBar = ({
	title,
	fallbackTitle,
	buttonText,
	isLoading,
	isValid,
}: Props) => {
	return (
		<div className='fixed bottom-0 left-0 right-0 z-30 p-3 bg-surface-card/90 backdrop-blur-md border-t border-accent md:hidden flex items-center justify-between gap-x-3'>
			<span className='text-sm text-secondary truncate font-medium'>
				{title || fallbackTitle}
			</span>
			<Button
				type='submit'
				isLoading={isLoading}
				variant={isValid ? 'primary' : 'disabled'}
				className='rounded-lg py-2.5 px-5 font-bold uppercase text-sm shrink-0'>
				{buttonText}
			</Button>
		</div>
	);
};
