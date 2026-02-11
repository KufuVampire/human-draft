interface Props {
	tags: {
		id: string;
		name: string;
	}[];
}

export const TagsList = ({ tags }: Props) => {
	return (
		<ul className='flex gap-2'>
			{tags.map(({ id, name }) => (
				<li
					key={id}
					className='text-xs leading-[150%] py-0.5 px-1 rounded-[0.125rem] cursor-default bg-secondary dark:bg-placeholder transition-colors'>
					#{name}
				</li>
			))}
		</ul>
	);
};
