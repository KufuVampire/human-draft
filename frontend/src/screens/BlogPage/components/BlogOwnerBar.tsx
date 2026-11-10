'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Dispatch, MouseEvent, ReactNode, SetStateAction } from 'react';

import { routesConfig } from '@/config';
import { Button, CustomLink, Dropdown, Section } from '@/shared';
import { cn } from '@/utils';

const btnStyles = 'px-3 py-2 leading-body font-bold rounded-lg';

interface Props {
	blogId: string;
	isOpen: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	items: ReactNode[];
	onTogglePin: (e: MouseEvent<HTMLUListElement>) => void;
	onDeleteBlog: () => void;
}

export const BlogOwnerBar = ({
	blogId,
	isOpen,
	setOpen,
	items,
	onTogglePin,
	onDeleteBlog,
}: Props) => {
	const t = useTranslations();

	return (
		<Section className='flex flex-col-reverse md:flex-row gap-2 py-0 md:py-0'>
			<Dropdown
				isOpen={isOpen}
				items={items}
				setOpen={setOpen}
				className='w-full'
				listClassName='w-full top-[calc(100%+0.5rem)] overflow-hidden py-3 px-2.5 shadow-secondary min-w-auto'
				onClick={onTogglePin}
				displayDirection='top'>
				<Button
					variant='secondary'
					className='bg-surface-card px-5 py-2 flex gap-x-5 rounded-lg w-full'
					onClick={() => setOpen((prev) => !prev)}>
					<span className='w-full inline-block text-left'>
						{t('blogPage.pinPosts.pin')}
					</span>
					<ChevronDown
						className={cn(
							'transition-transform shrink-0',
							isOpen && 'rotate-180'
						)}
					/>
				</Button>
			</Dropdown>
			<div className='flex gap-x-2'>
				<Button
					variant='secondary'
					className={btnStyles}
					onClick={onDeleteBlog}>
					{t('btns.remove')}
				</Button>
				<CustomLink
					href={routesConfig.blogUpdate(blogId)}
					variant='primary'
					className={cn(btnStyles, 'text-nowrap w-full md:w-auto')}>
					{t('blogPage.editBlog')}
				</CustomLink>
			</div>
		</Section>
	);
};
