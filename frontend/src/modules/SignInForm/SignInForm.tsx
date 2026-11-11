'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import { useSignInMutation } from '@/graphql/generated/output';
import { TypeSignInAccount, signInAccountSchema } from '@/schemas';
import { Button, FormField } from '@/shared';
import { useProfile } from '@/store';
import { IField } from '@/types';

const fields: IField<TypeSignInAccount>[] = [
	{
		text: 'fields.username',
		placeholder: 'fields.username',
		type: 'text',
		registerName: 'username',
		registerOptions: { required: true, min: 3, max: 16 },
	},
	{
		text: 'fields.password',
		placeholder: 'fields.password',
		type: 'password',
		registerName: 'password',
		registerOptions: { required: true, min: 8 },
	},
];

export const SignInForm = () => {
	const t = useTranslations();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { isValid },
		setFocus,
	} = useForm<TypeSignInAccount>({
		resolver: zodResolver(signInAccountSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});
	const setProfile = useProfile((s) => s.setProfile);

	const [signInMutation, { loading }] = useSignInMutation({
		onCompleted(data) {
			if (data.signIn) {
				setProfile(data.signIn);
				toast.success(t('authPages.signIn.signInSuccess'));
				router.push(routesConfig.home);
			}
		},
		onError(err) {
			console.error(err);
			toast.error(t('authPages.signIn.signInErrors.unableSignIn'));
		},
	});

	useEffect(() => {
		setFocus('username');
	}, [setFocus]);

	const onSubmit: SubmitHandler<TypeSignInAccount> = (data) => {
		const { username, password } = data;

		signInMutation({
			variables: {
				data: { username, password },
			},
		});
	};

	return (
		<form
			className='bg-surface-card border border-border-subtle shadow-md p-6 sm:p-8 rounded-2xl flex flex-col gap-y-5 transition-colors'
			onSubmit={handleSubmit(onSubmit)}>
			<h1 className='text-center text-2xl font-bold font-title text-foreground'>{t('authPages.signIn.title')}</h1>
			{fields.map((field) => (
				<FormField
					key={field.text}
					text={t(field.text)}
					placeholder={t(field.placeholder)}
					type={field.type}
					bottomText={field.bottomText ? t(field.bottomText) : ''}
					className='rounded-xl border border-border-subtle focus:border-primary'
					{...register(field.registerName, field.registerOptions)}
				/>
			))}
			<Button
				type='submit'
				variant='primary'
				isLoading={loading}
				disabled={!isValid || loading}
				className='rounded-xl py-3 font-semibold text-sm uppercase tracking-wider shadow-xs hover:shadow-primary transition-all mt-2'>
				{t('btns.signIn')}
			</Button>
		</form>
	);
};
