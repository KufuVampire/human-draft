import { cn } from '@/utils';

interface Props {
	size?: `${number}`;
	borderSize?: `${number}`;
}

export const Loader = ({ size = '40', borderSize = '4' }: Props) => {
	return (
		<div
			className={cn(
				'size-10 animate-spin border-4 border-b-4 border-primary border-b-transparent rounded-full'
			)}
			style={{
				width: Number(size),
				height: Number(size),
				borderWidth: Number(borderSize),
			}}
		/>
	);
};
