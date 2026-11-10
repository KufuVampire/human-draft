import { routesConfig } from '@/config';
import { CustomLink, TagsList, UserBadgeWithCreatedAt } from '@/shared';

const searchedItemStyles = 'items-start px-5 py-3 flex-col gap-y-2 group';

interface BaseItem {
	__typename?: string;
	id: string;
	title: string;
	author: {
		username: string;
		avatarUrl?: string | null;
	};
	createdAt: string;
	tags?: { id: string; name: string }[] | null;
}

export const renderSearchItems = (searchedItems: BaseItem[]) => {
	return searchedItems.map((o) => {
		const href =
			o.__typename === 'BlogModel'
				? routesConfig.blogById(o.id)
				: routesConfig.postById(o.id);

		return (
			<CustomLink
				key={o.id}
				href={href}
				className={searchedItemStyles}>
				<h2 className='font-title text-left text-xl leading-body'>
					{o.title}
				</h2>
				<UserBadgeWithCreatedAt
					author={o.author}
					createdAt={o.createdAt}
					type='not-link'
				/>
				{o.tags && <TagsList tags={o.tags} />}
			</CustomLink>
		);
	});
};
