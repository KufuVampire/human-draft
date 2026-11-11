'use client';

import { ChevronDown, Reply } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import {
	CommentFieldsFragment,
	useDeleteCommentMutation,
} from '@/graphql/generated/output';
import { Button } from '../Button/Button';
import { CreateCommentField } from '../CreateCommentField/CreateCommentField';
import { CommentItemEditForm } from './CommentItemEditForm';
import { CommentItemHeader } from './CommentItemHeader';
import { useComments, useModalStore, useProfileStore } from '@/store';
import { cn } from '@/utils';

interface Props {
	comment: CommentFieldsFragment;
	className?: string;
}

export const CommentItem = ({ comment, className }: Props) => {
	const profile = useProfileStore((s) => s.profile);
	const openModal = useModalStore((s) => s.openModal);
	const [isReply, setReply] = useState(false);
	const [isEditMode, setEditMode] = useState(false);
	const [isShowReplies, setShowReplies] = useState(false);
	const t = useTranslations();
	const { deleteComment: deleteComm } = useComments();

	const {
		author: { username, avatarUrl },
		createdAt,
		id,
		replies,
		text,
		parentId,
	} = comment;

	const isOwner = profile?.username === username;

	const [deleteComment] = useDeleteCommentMutation({
		onError(error) {
			toast.error(error.message || t('comments.deleteError'));
		},
	});

	const handleDeleteComment = (commentId: string) => {
		openModal('confirmationDeletion', {
			type: 'comment',
			cb: () => {
				deleteComm(commentId);
				deleteComment({
					variables: {
						commentId,
					},
				});
			},
		});
	};

	return (
		<li
			className={cn(
				'flex flex-col relative after:content-[""] after:absolute after:top-8 after:left-4 after:w-px after:bg-border-subtle after:bottom-5',
				isReply && 'after:bottom-3/4',
				isReply && replies && replies.length && 'after:bottom-16',
				className
			)}>
			<CommentItemHeader
				username={username}
				avatarUrl={avatarUrl}
				createdAt={createdAt}
				parentId={parentId}
				id={id}
				isOwner={isOwner}
				isEditMode={isEditMode}
				onToggleEditMode={() => setEditMode((prev) => !prev)}
				onDeleteComment={handleDeleteComment}
			/>
			<div className='flex flex-col gap-y-1 pl-9.5'>
				{isEditMode ? (
					<CommentItemEditForm
						id={id}
						initialText={text}
						className={className}
						onClose={() => setEditMode(false)}
					/>
				) : (
					<p className='leading-body tracking-snug text-foreground/90'>{text}</p>
				)}
				{!isReply && (
					<Button
						variant='clear'
						onClick={() => setReply(true)}
						className={cn(
							'flex items-center gap-x-1 font-semibold text-xs text-muted hover:text-primary self-start relative mt-1 transition-colors',
							replies &&
								replies.length < 1 &&
								'after:absolute after:-left-5.5 after:bottom-1/2 after:w-5 after:h-full after:border-l after:border-b after:border-border-subtle after:rounded-bl-xl'
						)}>
						<Reply className='size-3.5' />
						{t('btns.reply')}
					</Button>
				)}
				{isReply && (
					<CreateCommentField
						parentId={id}
						setReply={setReply}
						className={cn(
							'relative after:absolute after:-left-5.5 after:bottom-3/4 after:w-5 after:border-border-subtle after:border-l after:border-b',
							replies &&
								replies.length < 1 &&
								'after:rounded-bl-xl after:h-full'
						)}
					/>
				)}
				{isShowReplies && replies && replies.length > 0 && (
					<ul className='flex flex-col gap-y-3 mt-2'>
						{replies.map((reply) => (
							<CommentItem
								key={reply.id}
								comment={reply as CommentFieldsFragment}
							/>
						))}
					</ul>
				)}
				{replies && replies.length > 0 && (
					<Button
						variant='clear'
						className='relative self-start font-semibold text-xs text-muted hover:text-primary leading-normal flex items-center gap-x-1 mt-1 after:absolute after:-left-5.5 after:bottom-1/2 after:w-5 after:h-10 after:border-l after:border-b after:border-border-subtle after:rounded-bl-xl transition-colors'
						onClick={() => setShowReplies((prev) => !prev)}>
						{isShowReplies
							? t('comments.hideReplies')
							: t('comments.replies', { count: replies.length })}
						<ChevronDown
							className={cn(
								'size-3.5 transition-transform',
								isShowReplies && 'rotate-180'
							)}
						/>
					</Button>
				)}
			</div>
		</li>
	);
};
