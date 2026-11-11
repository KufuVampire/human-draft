'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import { useSignUpMutation } from '@/graphql/generated/output';
import { TypeCreateAccountSchema, createAccountSchema } from '@/schemas';
import { Button, FormField } from '@/shared';
import { useProfile } from '@/store';
import { IField } from '@/types';

const buttonStyles = 'py-2 rounded-lg';

const fields: IField<TypeCreateAccountSchema>[] = [
	{
		text: 'fields.email',
		placeholder: 'fields.email',
		type: 'email',
		registerName: 'email',
		registerOptions: { required: true },
	},
	{
		text: 'fields.username',
		placeholder: 'fields.username',
		type: 'text',
		registerName: 'username',
		registerOptions: { required: true, min: 3, max: 16 },
		bottomText: 'authPages.signUp.fieldsBottomText.min3Username',
	},
	{
		text: 'fields.password',
		placeholder: 'fields.password',
		type: 'password',
		registerName: 'password',
		registerOptions: { required: true, min: 8 },
		bottomText: 'authPages.signUp.fieldsBottomText.min8Password',
	},
	{
		text: 'fields.repeatPassword',
		placeholder: 'fields.repeatPassword',
		type: 'password',
		registerName: 'confirmPassword',
		registerOptions: { required: true, min: 8 },
		bottomText: 'authPages.signUp.fieldsBottomText.repeatPassword',
	},
];

export const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { isValid },
		setFocus,
	} = useForm<TypeCreateAccountSchema>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			email: '',
			username: '',
			password: '',
			confirmPassword: '',
		},
	});
	const t = useTranslations();
	const router = useRouter();
	const setProfile = useProfile((s) => s.setProfile);

	const [signUpMutation, { loading }] = useSignUpMutation({
		onCompleted(data) {
			if (data) {
				setProfile(data.signUp);
				toast.success(t('authPages.signUp.signUpSuccess'));
				router.push(routesConfig.home);
			}
		},
		onError() {
			toast.error(t('authPages.signUp.signUpErrors.unableSignUp'));
		},
	});

	useEffect(() => {
		setFocus('email');
	}, [setFocus]);

	const onSubmit: SubmitHandler<TypeCreateAccountSchema> = (data) => {
		if (data.password === data.confirmPassword) {
			const { email, password, username } = data;
			signUpMutation({
				variables: {
					data: {
						email,
						username,
						password,
					},
				},
			});
		} else {
			toast.error(t('authPages.signUp.signUpErrors.passwordsNotMatched'));
		}
	};

	return (
		<form
			className='bg-surface-card border border-border-subtle shadow-md p-6 sm:p-8 rounded-2xl flex flex-col gap-y-5 transition-colors'
			onSubmit={handleSubmit(onSubmit)}>
			<h1 className='text-center text-2xl font-bold font-title text-foreground'>{t('authPages.signUp.title')}</h1>
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
				{t('btns.signUp')}
			</Button>
		</form>
	);
};
