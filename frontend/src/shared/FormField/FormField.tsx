'use client';

import { Check, Circle, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HTMLProps, PropsWithChildren, forwardRef, useState } from 'react';

import { cn } from '@/utils';

interface Props extends HTMLProps<HTMLInputElement> {
	text?: string;
	bottomText?: string;
	wrapperClassNames?: string;
	inputWrapperClassName?: string;
	labelTextClassName?: string;
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
			labelTextClassName,
			children,
			...props
		},
		ref
	) => {
		const { type } = props;
		const [isShowPassword, setShowPassword] = useState(false);
		const t = useTranslations('btns');

		const isPasswordField = type === 'password';
		const passwordField = isShowPassword ? 'text' : 'password';
		const inputType = isPasswordField ? passwordField : type;

		return (
			<label
				className={cn(
					'flex flex-col gap-y-2 cursor-pointer transition-colors',
					(type === 'checkbox' || type === 'radio') &&
						'hover:text-primary flex-row-reverse items-center gap-x-2 p-2',
					wrapperClassNames
				)}>
				{text && (
					<span
						className={cn(
							'text-xl font-title font-bold leading-[110%]',
							(type === 'checkbox' || type === 'radio') &&
								'font-normal font-text',
							labelTextClassName
						)}>
						{text}
					</span>
				)}
				<div
					className={cn(
						'relative w-full transition',
						type === 'checkbox' &&
							'border size-6 rounded-sm p-0.5 hover:border-primary shrink-0 has-[input:checked]:border-primary has-[input:checked]:bg-primary flex items-center',
						type === 'radio' &&
							'border size-6 p-1 hover:border-primary shrink-0 flex justify-center items-center rounded-full has-[input:checked]:border-primary 	',
						inputWrapperClassName
					)}>
					{children}
					<input
						{...props}
						ref={ref}
						type={inputType}
						className={cn(
							'p-2.5 outline-0 border border-field hover:border-primary focus:border-primary rounded-md w-full bg-transparent [&:not(:placeholder-shown)]:border-primary [&:not(:placeholder-shown)]:shadow-[0px_0px_6px_0px_var(--color-primary)]',
							(type === 'checkbox' || type === 'radio') &&
								'appearance-none absolute top-0 peer p-0 border-none [&:not(:placeholder-shown)]:border-none [&:not(:placeholder-shown)]:shadow-none',
							props.className
						)}
					/>
					{type === 'checkbox' && (
						<Check
							className={cn(
								'size-5 stroke-secondary opacity-0 transition-opacity duration-100 shrink-0 peer-checked:opacity-100'
							)}
						/>
					)}
					{type === 'radio' && (
						<Circle
							className={cn(
								'size-4 stroke-primary fill-primary opacity-0 transition-opacity duration-100 shrink-0 peer-checked:opacity-100'
							)}
						/>
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
