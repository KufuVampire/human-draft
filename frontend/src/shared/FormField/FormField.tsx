'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HTMLProps, useState } from 'react';

import { cn } from '@/utils';

interface Props extends HTMLProps<HTMLInputElement> {
	text: string;
	bottomText?: string;
	wrapperClassNames?: string;
}

const iconStyles =
	'absolute stroke-[var(--stroke-form-icon)] cursor-pointer hover:stroke-primary-hover transition-colors -translate-1/2 top-1/2 right-0';

export const FormField = ({
	text,
	bottomText,
	wrapperClassNames,
	...props
}: Props) => {
	const { type } = props;
	const [isShowPassword, setShowPassword] = useState(false);
	const t = useTranslations('btns');

	const isPasswordField = type === 'password';
	const inputType = isPasswordField
		? isShowPassword
			? 'text'
			: 'password'
		: type;

	return (
		<label className={cn('flex flex-col gap-y-2', wrapperClassNames)}>
			<span className='text-xl'>{text}</span>
			<div className='relative w-full'>
				<input
					{...props}
					type={inputType}
					className='p-2.5 outline-0 border border-field hover:border-primary focus:border-primary rounded-md w-full bg-transparent [&:not(:placeholder-shown)]:border-primary [&:not(:placeholder-shown)]:shadow-[0px_0px_6px_0px_var(--color-primary)]'
				/>
				{type === 'password' && !isShowPassword && (
					<Eye
						className={iconStyles}
						onClick={() => setShowPassword(true)}>
						<title>{t('showPassword')}</title>
					</Eye>
				)}
				{type === 'password' && isShowPassword && (
					<EyeOff
						className={iconStyles}
						onClick={() => setShowPassword(false)}>
						<title>{t('hidePassword')}</title>
					</EyeOff>
				)}
			</div>
			<span className='text-sm text-gray-500'>{bottomText}</span>
		</label>
	);
};
