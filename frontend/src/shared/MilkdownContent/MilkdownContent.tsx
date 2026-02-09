interface Props {
	content: string;
}

export const MilkdownContent = ({ content }: Props) => {
	return (
		<div
			className='milkdown-content'
			dangerouslySetInnerHTML={{
				__html: content,
			}}
		/>
	);
};
