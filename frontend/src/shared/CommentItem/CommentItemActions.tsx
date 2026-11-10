'use client';

import { Pencil, Trash, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '../Button/Button';

interface Props {
	isEditMode: boolean;
	onToggleEditMode: () => void;
	onDeleteComment: () => void;
}

export const CommentItemActions = ({
	isEditMode,
	onToggleEditMode,
	onDeleteComment,
}: Props) => {
	const t = useTranslations();

	return (
		<div className='flex items-center gap-x-2'>
			<Button
				variant='clear'
				title={
					isEditMode
						? t('postPage.comments.exitEditMode')
						: t('postPage.comments.enterEditMode')
				}
				onClick={onToggleEditMode}>
				{isEditMode ? (
					<X className='size-4' />
				) : (
					<Pencil className='size-4' />
				)}
			</Button>
			<Button
				variant='clear'
				title={t('postPage.comments.deleteComment')}
				onClick={onDeleteComment}>
				<Trash className='size-4' />
			</Button>
		</div>
	);
};
