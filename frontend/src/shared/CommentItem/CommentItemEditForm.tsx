'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useUpdateCommentMutation } from '@/graphql/generated/output';
import { TypeUpdateCommentSchema } from '@/schemas';
import { Button } from '../Button/Button';
import { FormField } from '../FormField/FormField';
import { useComments } from '@/store';
import { cn } from '@/utils';

interface Props {
	id: string;
	initialText: string;
	className?: string;
	onClose: () => void;
}

const buttonStyles =
	'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all';

export const CommentItemEditForm = ({
	id,
	initialText,
	className,
	onClose,
}: Props) => {
	const t = useTranslations();
	const { updateComment: updateComm } = useComments();

	const {
		register,
		formState: { isValid, isDirty },
		handleSubmit,
		reset,
		setFocus,
	} = useForm<TypeUpdateCommentSchema>({
		mode: 'onChange',
		defaultValues: {
			text: initialText,
		},
	});

	useEffect(() => {
		setFocus('text');
	}, [setFocus]);

	const [updateComment, { loading: isUpdating }] = useUpdateCommentMutation({
		onError(error) {
			toast.error(error.message || t('comments.updateError'));
		},
	});

	const onSubmit: SubmitHandler<TypeUpdateCommentSchema> = ({
		text: updatedText,
	}) => {
		const trimmedText = updatedText.trim();
		if (!trimmedText) return;

		updateComment({
			variables: {
				commentId: id,
				text: trimmedText,
			},
			onCompleted() {
				updateComm(id, trimmedText);
				reset({ text: trimmedText });
				onClose();
			},
		});
	};

	return (
		<form
			className={cn('flex flex-col gap-y-3', className)}
			onSubmit={handleSubmit(onSubmit)}>
			<div className='flex gap-x-2'>
				<FormField
					wrapperClassNames='w-full'
					className='border-0 border-b rounded-none [&:not(:placeholder-shown)]:shadow-none px-0 pt-0'
					{...register('text', {
						required: true,
						validate: (value) => !!value?.trim(),
					})}
					placeholder={t('fields.comment')}
				/>
			</div>
			<div className='flex gap-x-2 justify-end'>
				<Button
					className={buttonStyles}
					type='submit'
					isLoading={isUpdating}
					disabled={!isValid || !isDirty || isUpdating}>
					{t('comments.updateComment')}
				</Button>
			</div>
		</form>
	);
};
