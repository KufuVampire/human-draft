'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '../Button/Button';
import { FormField } from '../FormField/FormField';
import { UserBadge } from '../UserBadge/UserBadge';

import {
	GetPostByIdDocument,
	useCreateCommentMutation,
} from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { TypeCreateCommentSchema } from '@/schemas';
import { cn } from '@/utils';

const buttonStyles =
	'px-2 py-1.5 leading-[110%] tracking-[5%] uppercase rounded-sm';

interface Props {
	parentId?: string;
	setReply?: Dispatch<SetStateAction<boolean>>;
	className?: string;
}

export const CreateCommentField = ({
	parentId,
	setReply,
	className,
}: Props) => {
	const { postId } = useParams<{ postId: string }>();
	const t = useTranslations();
	const { profile, isAuth } = useProfile();

	const {
		register,
		formState: { isValid },
		reset,
		handleSubmit,
	} = useForm<TypeCreateCommentSchema>();

	const handleCancel = () => {
		reset({ text: '' });

		if (setReply) {
			setReply(false);
		}
	};

	const [createComment, { loading: isCreating }] = useCreateCommentMutation({
		onCompleted() {
			console.log('success');
			handleCancel();
		},
		refetchQueries: [
			{
				query: GetPostByIdDocument,
				variables: { postId },
			},
		],
	});

	if (!isAuth) {
		return (
			<div>Только авторизованные пользователи могут оставить комментарий</div>
		);
	}

	const onSubmit: SubmitHandler<TypeCreateCommentSchema> = ({ text }) => {
		if (!text.trim()) return;

		createComment({
			variables: {
				postId,
				text,
				parentId,
			},
		});
	};

	return (
		<form
			className={cn('flex flex-col gap-y-3', className)}
			onSubmit={handleSubmit(onSubmit)}>
			<div className='flex gap-x-2'>
				{profile && (
					<UserBadge
						location='comment-field'
						avatarUrl={profile.avatarUrl}
						username={profile.username}
					/>
				)}
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
					variant='secondary'
					type='button'
					onClick={handleCancel}>
					{t('btns.cancel')}
				</Button>
				<Button
					className={buttonStyles}
					type='submit'
					isLoading={isCreating}
					disabled={isValid}>
					{t('comments.leaveComment')}
				</Button>
			</div>
		</form>
	);
};
