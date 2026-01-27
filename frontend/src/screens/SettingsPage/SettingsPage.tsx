'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { RedirectType, redirect, useParams } from 'next/navigation';
import { useEffect, useId } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import { useUpdateProfileMutation } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { TypeUpdateProfileSchema, updateProfileSchema } from '@/schemas';
import { Button, FormField, Loader, Section, UserAvatar } from '@/shared';
import { useConfirmationChangesModal } from '@/store';
import { IField } from '@/types';

const fieldItems: IField<TypeUpdateProfileSchema>[] = [
	{
		text: 'fields.username',
		placeholder: 'fields.username',
		type: 'text',
		registerName: 'username',
		registerOptions: {
			minLength: 3,
			maxLength: 16,
			required: true,
		},
	},
	{
		text: 'fields.email',
		placeholder: 'fields.email',
		type: 'email',
		registerName: 'email',
		registerOptions: {
			required: true,
		},
	},
	{
		text: 'fields.shortDescription',
		placeholder: 'fields.shortDescription',
		type: 'text',
		registerName: 'description',
		registerOptions: {},
	},
];

export const SettingsPage = () => {
	const t = useTranslations();
	const { username } = useParams();
	const {
		profile,
		isLoading,
		updateProfile,
		handleChangeAvatar,
		isAvatarChanging,
	} = useProfile();
	const formId = useId();
	const {
		register,
		handleSubmit,
		reset,
		setFocus,
		formState: { isValid, isDirty },
	} = useForm<TypeUpdateProfileSchema>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			username: '',
			email: '',
			description: '',
		},
	});
	const { setCb, setOpen } = useConfirmationChangesModal();
	const [updateProfileMutation] = useUpdateProfileMutation({
		onCompleted() {
			toast.success(t('settingsPage.notifications.updateSuccess'));
		},
		onError(error) {
			toast.error(t('settingsPage.notifications.updateError'));
			console.error(error);
		},
	});

	useEffect(() => {
		if (profile) {
			reset({
				username: profile.username ?? '',
				email: profile.email ?? '',
				description: profile.description ?? '',
			});
			setFocus('username');
		}
	}, [profile, reset, setFocus]);

	if (!isLoading && username !== profile?.username) {
		return (
			<Section className='bg-[var(--background-color-card)] transition-colors w-full px-2 py-6 md:px-6 rounded-xl flex items-center justify-center'>
				<h1 className='font-title font-bold'>{t('settingsPage.notMyAcc')}</h1>
			</Section>
		);
	}

	if (isLoading) {
		return (
			<Section className='bg-[var(--background-color-card)] transition-colors w-full px-2 py-6 md:px-6 rounded-xl flex items-center justify-center'>
				<Loader />
			</Section>
		);
	}

	const onSubmit: SubmitHandler<TypeUpdateProfileSchema> = (data) => {
		setCb(() => {
			updateProfileMutation({
				variables: {
					data,
				},
			});
			setOpen(false);
			updateProfile(data);
			redirect(
				`/${data.username}/${routesConfig.settings}`,
				RedirectType.replace
			);
		});
		setOpen(true);
	};

	return (
		<Section className='bg-[var(--background-color-card)] transition-colors w-full px-2 py-6 md:px-6 rounded-xl flex flex-col md:gap-y-12 gap-y-6'>
			<h1 className='font-title font-bold text-[1.75rem] md:text-5xl leading-[110%] text-center md:text-left'>
				{t('settingsPage.metadata.title')}
			</h1>
			<div className='flex flex-col md:flex-row gap-6 items-center'>
				<label className='relative size-42.5 md:border border-primary rounded-full bg-[var(--background-color-card)] transition-colors cursor-pointer md:self-start shrink-0'>
					<input
						type='file'
						className='hidden'
						onChange={handleChangeAvatar}
						disabled={isAvatarChanging}
					/>
					<div className='md:border-2 border-secondary bg-[rgba(27,74,90,0.5)] md:bg-primary absolute inset-0 md:top-auto md:left-auto md:bottom-0 md:right-0 rounded-full overflow-hidden p-2 z-10 flex items-center justify-center md:block'>
						<Camera className='size-14 md:size-8 stroke-secondary' />
					</div>
					<UserAvatar
						avatarUrl={profile?.avatarUrl}
						username={profile?.username}
						location='settings-page'
					/>
					{/* {profile?.avatarUrl && (
						<div className='size-full rounded-full relative'>
							<Image
								src={profile.avatarUrl}
								alt={`${t('userAvatar')} ${username}`}
								fill
								sizes='100%'
								className='rounded-full object-cover'
								loading='eager'
								unoptimized
							/>
						</div>
					)}
					{!profile?.avatarUrl && (
						<div className='uppercase flex items-center justify-center bg-[linear-gradient(45deg,#4792c1,#aa67c2,#ea2047)] text-secondary text-7xl size-full rounded-full'>
							{profile && profile.username.at(0)}
						</div>
					)} */}
				</label>
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
				variant={isValid && isDirty ? 'primary' : 'disabled'}
				className='py-4 rounded-[0.625rem] md:text-xl md:font-bold leading-[120%] uppercase tracking-[5%] md:tracking-[10%]'>
				{t('btns.saveChanges')}
			</Button>
		</Section>
	);
};
