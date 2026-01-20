'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { routesConfig } from '@/config';
import { useSignUpMutation } from '@/graphql/generated/output';
import { TypeCreateAccountSchema, createAccountSchema } from '@/schemas';
import { Button, FormField } from '@/shared';
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

	const [signUpMutation, { loading }] = useSignUpMutation({
		onCompleted(data) {
			if (data) {
				toast.success(t('authPages.signUp.signUpSuccess'));
				redirect(routesConfig.home);
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
			className='border-2 border-primary p-3 rounded-xl flex flex-col gap-y-4'
			onSubmit={handleSubmit(onSubmit)}>
			<h1 className='text-center text-3xl'>{t('authPages.signUp.title')}</h1>
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
					className={buttonStyles}
					disabled={!isValid}>
					{t('btns.signUp')}
				</Button>
			) : (
				<Button
					variant='disabled'
					className={buttonStyles}
					disabled>
					{t('loading')}
				</Button>
			)}
		</form>
	);
};
