'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HTMLProps, forwardRef, useState } from 'react';

import { cn } from '@/utils';

interface Props extends HTMLProps<HTMLInputElement> {
	text?: string;
	bottomText?: string;
	wrapperClassNames?: string;
	inputWrapperClassName?: string
}

const iconStyles =
	'absolute stroke-[var(--stroke-form-icon)] cursor-pointer hover:stroke-primary-hover transition-colors -translate-1/2 top-1/2 right-0';

export const FormField = forwardRef<HTMLInputElement, Props>(
	({ text, bottomText, wrapperClassNames, inputWrapperClassName, ...props }, ref) => {
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
				{text && <span className='text-xl'>{text}</span>}
				<div className={cn('relative w-full', inputWrapperClassName)}>
					<input
						{...props}
						ref={ref}
						type={inputType}
						className={cn(
							'p-2.5 outline-0 border border-field hover:border-primary focus:border-primary rounded-md w-full bg-transparent [&:not(:placeholder-shown)]:border-primary [&:not(:placeholder-shown)]:shadow-[0px_0px_6px_0px_var(--color-primary)]',
							props.className
						)}
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
				{bottomText && (
					<span className='text-sm text-gray-500'>{bottomText}</span>
				)}
			</label>
		);
	}
);

FormField.displayName = 'FormField';
