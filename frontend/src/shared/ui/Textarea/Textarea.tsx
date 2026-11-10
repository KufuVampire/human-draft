import { cva, type VariantProps } from 'class-variance-authority';
import {
	forwardRef,
	TextareaHTMLAttributes,
	useCallback,
	useRef,
} from 'react';

import { cn } from '@/utils';

export const textareaVariants = cva(
	'w-full bg-surface-card text-foreground placeholder:text-placeholder outline-none transition-colors border rounded-xl p-3 text-sm font-text resize-none',
	{
		variants: {
			state: {
				default:
					'border-border-field focus:border-primary focus:shadow-focus',
				error: 'border-error text-error focus:border-error',
				disabled:
					'opacity-50 cursor-not-allowed border-border-subtle bg-surface-tag select-none',
			},
		},
		defaultVariants: {
			state: 'default',
		},
	}
);

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement>,
		VariantProps<typeof textareaVariants> {
	autoResize?: boolean;
	error?: boolean | string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			autoResize = true,
			error,
			disabled,
			onInput,
			rows = 3,
			...props
		},
		forwardedRef
	) => {
		const localRef = useRef<HTMLTextAreaElement | null>(null);
		const state = disabled ? 'disabled' : error ? 'error' : 'default';

		const handleResize = useCallback(() => {
			if (!autoResize || !localRef.current) return;
			localRef.current.style.height = 'auto';
			localRef.current.style.height = `${localRef.current.scrollHeight}px`;
		}, [autoResize]);

		return (
			<textarea
				ref={(el) => {
					localRef.current = el;
					if (typeof forwardedRef === 'function') {
						forwardedRef(el);
					} else if (forwardedRef) {
						forwardedRef.current = el;
					}
				}}
				rows={rows}
				disabled={disabled}
				aria-invalid={Boolean(error)}
				onInput={(e) => {
					handleResize();
					onInput?.(e);
				}}
				className={cn(textareaVariants({ state }), className)}
				{...props}
			/>
		);
	}
);

Textarea.displayName = 'Textarea';
