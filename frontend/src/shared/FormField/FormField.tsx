'use client';

import { Check, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HTMLProps, PropsWithChildren, forwardRef, useState } from 'react';

import { cn } from '@/utils';

interface Props extends HTMLProps<HTMLInputElement> {
	text?: string;
	bottomText?: string;
	wrapperClassNames?: string;
	inputWrapperClassName?: string;
}

const iconStyles =
	'absolute stroke-[var(--stroke-form-icon)] cursor-pointer hover:stroke-primary-hover transition-colors -translate-1/2 top-1/2 right-0';

export const FormField = forwardRef<HTMLInputElement, PropsWithChildren<Props>>(
	(
		{
			text,
			bottomText,
			wrapperClassNames,
			inputWrapperClassName,
			children,
			...props
		},
		ref
	) => {
		const { type, checked } = props;
		const [isShowPassword, setShowPassword] = useState(false);
		const t = useTranslations('btns');

		const isPasswordField = type === 'password';
		const inputType = isPasswordField
			? isShowPassword
				? 'text'
				: 'password'
			: type;

		return (
			<label
				className={cn(
					'flex flex-col gap-y-2 cursor-pointer',
					type === 'checkbox' && 'hover:text-primary transition-colors',
					wrapperClassNames
				)}>
				{text && <span className='text-xl'>{text}</span>}
				<div
					className={cn(
						'relative w-full',
						type === 'checkbox' && 'border size-6 rounded-sm p-0.5 hover:border-primary shrink-0',
						checked && 'border-primary bg-primary transition-colors',
						inputWrapperClassName
					)}>
					{children}
					<input
						{...props}
						ref={ref}
						type={inputType}
						className={cn(
							'p-2.5 outline-0 border border-field hover:border-primary focus:border-primary rounded-md w-full bg-transparent [&:not(:placeholder-shown)]:border-primary [&:not(:placeholder-shown)]:shadow-[0px_0px_6px_0px_var(--color-primary)]',
							type === 'checkbox' && 'appearance-none absolute top-0',
							props.className
						)}
					/>
					{type === 'checkbox' && (
						<Check className={cn('size-5 stroke-secondary opacity-0 transition-opacity duration-100 shrink-0', checked && 'opacity-100')} />
					)}
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
