'use client';

import { InputHTMLAttributes, PropsWithChildren, useId } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	text: string;
}

export const RadioButton = ({
	text,
	children,
	...props
}: PropsWithChildren<Props>) => {
	const id = useId();
	return (
		<label className='flex items-center gap-x-2 cursor-pointer text-[var(--text-color-main)] hover:text-primary-hover focus-visible:text-primary-hover transition-colors'>
			<input
				id={id}
				type='radio'
				{...props}
				className='appearance-none rounded-full relative md:size-6 size-5 border border-primary before:absolute before:top-1/2 before:left-1/2 before:-translate-1/2 md:before:size-4 before:size-3 before:rounded-full before:bg-primary before:opacity-0 checked:before:opacity-100 transition-opacity'
			/>
			{text || children}
		</label>
	);
};
