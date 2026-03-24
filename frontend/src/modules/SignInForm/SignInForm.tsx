'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
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
				redirect(routesConfig.home);
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
			className='border-2 border-primary p-3 rounded-xl flex flex-col gap-y-4'
			onSubmit={handleSubmit(onSubmit)}>
			<h1 className='text-center text-3xl'>{t('authPages.signIn.title')}</h1>
			{fields.map((field) => (
				<FormField
					key={field.text}
					text={t(field.text)}
					placeholder={t(field.placeholder)}
					type={field.type}
					bottomText={field.bottomText ? t(field.bottomText) : ''}
					{...register(field.registerName, field.registerOptions)}
				/>
			))}
			{!loading ? (
				<Button
					type='submit'
					variant={isValid ? 'primary' : 'disabled'}
					className='rounded-lg py-2'
					disabled={!isValid}>
					{t('btns.signIn')}
				</Button>
			) : (
				<button
					className='rounded-lg py-2 transition-colors bg-gray-400'
					disabled>
					{t('loading')}
				</button>
			)}
		</form>
	);
};
