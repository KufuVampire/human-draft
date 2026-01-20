'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useId } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { routesConfig } from '@/config';
import { useProfile } from '@/hooks';
import { TypeUpdateProfileSchema, updateProfileSchema } from '@/schemas';
import { Button, FormField, Section, UserAvatar } from '@/shared';
import { useConfirmationChangesModal } from '@/store';
import { IField } from '@/types';

export const SettingsPage = () => {
	const t = useTranslations();
	const { username } = useParams();
	const { profile, isLoading } = useProfile();
	const formId = useId();
	const {
		register,
		handleSubmit,
		reset,
		setFocus,
		formState: { isValid },
	} = useForm<TypeUpdateProfileSchema>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			username: '',
			email: '',
			description: '',
		},
	});
	const { setCb, setOpen } = useConfirmationChangesModal();

	useEffect(() => {
		if (!profile) return;
		reset({
			username: profile.username ?? '',
			email: profile.email ?? '',
			description: profile.description ?? '',
		});
	}, [profile, reset, setFocus]);

	useEffect(() => {
		setFocus('username');
	}, [setFocus]);

	if (!isLoading && profile && username !== profile.username) {
		redirect(routesConfig.home);
	}

	if (isLoading) {
		return (
			<Section className='bg-[var(--background-color-card)] transition-colors w-full px-2 py-6 md:px-6 rounded-xl'>
				<p className='text-3xl'>Loading...</p>
			</Section>
		);
	}

	const fieldItems: IField<TypeUpdateProfileSchema>[] = [
		{
			text: 'fields.username',
			placeholder: 'fields.username',
			type: 'text',
			registerName: 'username',
			registerOptions: {
				min: 3,
				max: 16,
			},
		},
		{
			text: 'fields.email',
			placeholder: 'fields.email',
			type: 'email',
			registerName: 'email',
			registerOptions: {},
		},
		{
			text: 'fields.shortDescription',
			placeholder: 'fields.shortDescription',
			type: 'text',
			registerName: 'description',
			registerOptions: {},
		},
	];

	const onSubmit: SubmitHandler<TypeUpdateProfileSchema> = (data) => {
		setOpen(true);
		setCb(() => {
			console.log(data);
		});
	};

	return (
		<Section className='bg-[var(--background-color-card)] transition-colors w-full px-2 py-6 md:px-6 rounded-xl flex flex-col md:gap-y-12 gap-y-6'>
			<h1 className='font-title font-bold text-[1.75rem] md:text-5xl leading-[110%] text-center md:text-left'>
				{t('settingsPage.metadata.title')}
			</h1>
			<div className='flex flex-col md:flex-row gap-6 items-center'>
				<UserAvatar
					avatarUrl={profile?.avatarUrl}
					username={profile?.username}
					className='mt-0 shrink-0 self-start'
				/>
				<form
					id={formId}
					className='flex flex-col gap-y-5 w-full'
					onSubmit={handleSubmit(onSubmit)}>
					{fieldItems.map(
						({ text, placeholder, type, registerName, registerOptions }) => (
							<FormField
								key={text}
								text={t(text)}
								type={type}
								placeholder={t(placeholder)}
								wrapperClassNames='font-bold text-xl leading-[110%] font-title'
								className='rounded-xl px-4 py-3 text-[1rem] leading-6 font-normal'
								{...register(registerName, registerOptions)}
							/>
						)
					)}
				</form>
			</div>
			<Button
				form={formId}
				type='submit'
				disabled={!isValid}
				className='py-4 rounded-[0.625rem] md:text-xl md:font-bold leading-[120%] uppercase tracking-[5%] md:tracking-[10%]'>
				{t('btns.saveChanges')}
			</Button>
		</Section>
	);
};
