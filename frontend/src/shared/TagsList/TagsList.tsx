import { cn } from '@/utils';

interface Props {
	tags: {
		id: string;
		name: string;
	}[];
	location?: 'blog' | 'post';
}

export const TagsList = ({ tags, location = 'post' }: Props) => {
	return (
		<ul className='flex gap-2'>
			{tags.map(({ id, name }) => (
				<li
					key={id}
					className={cn(
						'text-xs leading-body py-0.5 px-1 rounded-xs font-light cursor-default bg-secondary dark:bg-placeholder transition-colors group-hover:text-foreground text-foreground',
						{
							['bg-[rgba(229,229,229,0.25)] dark:bg-[rgba(229,229,229,0.25)] backdrop-blur-xs text-secondary']:
								location === 'blog',
						}
					)}>
					<span>#</span>
					<span>{name}</span>
				</li>
			))}
		</ul>
	);
};
