'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useId } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SettingsAvatarUpload } from './components/SettingsAvatarUpload';
import { settingsFieldItems } from './settingsFields';
import { routesConfig } from '@/config';
import { useUpdateProfileMutation } from '@/graphql/generated/output';
import { useProfileAvatar } from '@/hooks';
import { TypeUpdateProfileSchema, updateProfileSchema } from '@/schemas';
import {
	Button,
	FormField,
	Section,
	SettingsPageSkeleton,
} from '@/shared';
import { useModalStore, useProfileStore } from '@/store';

export const SettingsPage = () => {
	const t = useTranslations();
	const router = useRouter();
	const { username } = useParams();
	const profile = useProfileStore((s) => s.profile);
	const isLoading = useProfileStore((s) => s.isLoading);
	const updateProfile = useProfileStore((s) => s.updateProfile);
	const { handleChangeAvatar, isAvatarChanging } = useProfileAvatar();
	const openModal = useModalStore((s) => s.openModal);
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
			<Section className='bg-surface-card transition-colors w-full px-2 py-6 md:px-6 rounded-xl flex items-center justify-center'>
				<h1 className='font-title font-bold'>{t('settingsPage.notMyAcc')}</h1>
			</Section>
		);
	}

	if (isLoading) {
		return <SettingsPageSkeleton />;
	}

	const onSubmit: SubmitHandler<TypeUpdateProfileSchema> = (data) => {
		openModal('confirmationChanges', {
			cb: () => {
				updateProfileMutation({
					variables: {
						data,
					},
				});
				updateProfile(data);
				router.replace(`/${data.username}/${routesConfig.settings}`);
			},
		});
	};

	return (
		<Section className='bg-surface-card rounded-2xl border border-border-subtle shadow-sm transition-colors w-full p-6 md:p-10 flex flex-col gap-y-8'>
			<h1 className='font-title font-bold text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight text-center md:text-left'>
				{t('settingsPage.metadata.title')}
			</h1>
			<div className='flex flex-col md:flex-row gap-8 items-center md:items-start'>
				<SettingsAvatarUpload
					avatarUrl={profile?.avatarUrl}
					username={profile?.username}
					onChangeAvatar={handleChangeAvatar}
					isAvatarChanging={isAvatarChanging}
				/>
				<form
					id={formId}
					className='flex flex-col gap-y-5 w-full'
					onSubmit={handleSubmit(onSubmit)}>
					{settingsFieldItems.map(
						({ text, placeholder, type, registerName, registerOptions }) => (
							<FormField
								key={text}
								text={t(text)}
								type={type}
								placeholder={t(placeholder)}
								wrapperClassNames='font-semibold text-base font-title'
								className='rounded-xl px-4 py-3 text-base font-normal border-border-subtle'
								{...register(registerName, registerOptions)}
							/>
						)
					)}
				</form>
			</div>
			<Button
				form={formId}
				type='submit'
				variant='primary'
				disabled={!isValid || !isDirty}
				className='py-3.5 w-full rounded-xl font-bold text-sm uppercase tracking-wider shadow-xs hover:shadow-primary transition-all'>
				{t('btns.saveChanges')}
			</Button>
		</Section>
	);
};
