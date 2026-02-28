'use client';

import { Check, ChevronDown, Pencil, Reply, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
	CommentFieldsFragment,
	useDeleteCommentMutation,
	useUpdateCommentMutation,
} from '@/graphql/generated/output';
import { TypeUpdateCommentSchema } from '@/schemas';
import {
	Button,
	CommentsList,
	CreateCommentField,
	FormField,
	UserBadgeWithCreatedAt,
} from '@/shared';
import { useComments, useConfirmationDeletionModal, useProfile } from '@/store';
import { cn } from '@/utils';

interface Props {
	comment: CommentFieldsFragment;
	className?: string;
}

const buttonStyles =
	'px-2 py-1.5 leading-[110%] tracking-[5%] uppercase rounded-sm';

export const CommentItem = ({ comment, className }: Props) => {
	const { profile } = useProfile();
	const { setCb, setOpen, setType } = useConfirmationDeletionModal();
	const [isReply, setReply] = useState(false);
	const [isEditMode, setEditMode] = useState(false);
	const [isShowReplies, setShowReplies] = useState(false);
	const t = useTranslations();
	const { deleteComment: deleteComm } = useComments();

	const {
		register,
		formState: { isValid, isDirty },
		handleSubmit,
		setValue,
		watch,
		setFocus,
	} = useForm<TypeUpdateCommentSchema>();

	const [updateComment, { loading: isUpdating }] = useUpdateCommentMutation();

	const {
		author: { username, avatarUrl },
		createdAt,
		id,
		replies,
		text,
		parentId,
	} = comment;

	const isOwner = profile?.username === username;

	const [deleteComment] = useDeleteCommentMutation();

	const handleDeleteComment = (commentId: string) => {
		setType('comment');
		setCb(() => {
			console.log(commentId);
			deleteComm(commentId);
			deleteComment({
				variables: {
					commentId,
				},
			});
			setOpen(false);
		});
		setOpen(true);
	};

	const onSubmit: SubmitHandler<TypeUpdateCommentSchema> = ({ text }) => {
		if (!text.trim()) return;

		updateComment({
			variables: {
				commentId: id,
				text,
			},
		});
		setEditMode(false);
	};

	return (
		<li
			className={cn(
				'flex flex-col relative after:content-[""] after:absolute after:top-8 after:left-4 after:w-0.25 after:bg-placeholder after:bottom-5',
				isReply && 'after:bottom-3/4',
				isReply && replies && replies.length && 'after:h-3/4',
				className
			)}>
			<div
				className={cn(
					'flex items-center justify-between relative',
					parentId &&
						'after:content-[""] after:absolute after:top-4 after:-left-5 after:w-5 after:h-0.25 after:bg-placeholder'
				)}>
				<UserBadgeWithCreatedAt
					author={{ username, avatarUrl }}
					createdAt={createdAt}
					location='comment-item'
					className='z-10'
				/>
				{isOwner && (
					<div className='flex items-center gap-x-2'>
						<Button
							variant='clear'
							title={isEditMode ? t('postPage.comments.exitEditMode') : t('postPage.comments.enterEditMode')}
							onClick={() => {
								if (!watch('text')) {
									setValue('text', text);
								}

								setEditMode((prev) => !prev);
								if (isEditMode) {
									setFocus('text');
								}
							}}>
							{isEditMode ? (
								<Check className='size-4' />
							) : (
								<Pencil className='size-4' />
							)}
						</Button>
						<Button
							variant='clear'
							title={t('postPage.comments.deleteComment')}
							onClick={() => handleDeleteComment(id)}>
							<Trash className='size-4' />
						</Button>
					</div>
				)}
			</div>
			<div className='flex flex-col gap-y-1 pl-9.5'>
				{isEditMode ? (
					<form
						className={cn('flex flex-col gap-y-3', className)}
						onSubmit={handleSubmit(onSubmit)}>
						<div className='flex gap-x-2'>
							<FormField
								wrapperClassNames='w-full'
								className='border-0 border-b rounded-none [&:not(:placeholder-shown)]:shadow-none px-0 pt-0'
								{...register('text', { required: true })}
								placeholder={t('fields.comment')}
							/>
						</div>
						<div className='flex gap-x-2 justify-end'>
							<Button
								className={buttonStyles}
								type='submit'
								isLoading={isUpdating}
								disabled={isValid}>
								{t('comments.updateComment')}
							</Button>
						</div>
					</form>
				) : (
					<p className='leading-[150% tracking-[2%]'>
						{isDirty ? watch('text') : text}
					</p>
				)}
				{!isReply && (
					<Button
						variant='clear'
						onClick={() => setReply(true)}
						className={cn(
							'flex items-center gap-x-1 font-bold text-xs leading-[150%] self-start relative',
							replies &&
								replies.length < 1 &&
								'after:absolute after:-left-5.5 after:bottom-1/2 after:w-5 after:h-full after:border-l after:border-b after:border-placeholder after:rounded-bl-xl'
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
							'relative after:absolute after:-left-5.5 after:bottom-3/4 after:w-5 after:border-placeholder after:border-l after:border-b',
							replies &&
								replies.length < 1 &&
								'after:rounded-bl-xl after:h-full'
						)}
					/>
				)}
				{isShowReplies && replies && replies.length > 0 && (
					<CommentsList data={replies} />
				)}
				{replies && replies.length > 0 && (
					<Button
						variant='clear'
						className='relative self-start font-bold leading-[150%] flex items-center gap-x-1 after:absolute after:-left-5.5 after:bottom-[50%] after:w-5 after:h-10 after:border-l after:border-b after:border-placeholder after:rounded-bl-xl'
						onClick={() => setShowReplies((prev) => !prev)}>
						{isShowReplies
							? t('comments.hideReplies')
							: t('comments.replies', { count: replies.length })}
						<ChevronDown
							className={cn(
								'transition-transform',
								isShowReplies && 'rotate-180'
							)}
						/>
					</Button>
				)}
			</div>
		</li>
	);
};
