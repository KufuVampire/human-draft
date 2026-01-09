import { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLInputElement> {
	text: string;
}

export const Checkbox = ({
	text,
	children,
	...props
}: PropsWithChildren<Props>) => {
	return (
		<label>
			{text || children}
			<input
				type='checkbox'
				className='appearance-none'
				{...props}
			/>
		</label>
	);
};
