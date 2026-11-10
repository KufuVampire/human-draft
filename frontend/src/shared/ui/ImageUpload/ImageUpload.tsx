import { Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import {
	ChangeEvent,
	DragEvent,
	forwardRef,
	KeyboardEvent,
	useRef,
	useState,
} from 'react';

import { cn } from '@/utils';

export interface ImageUploadProps {
	value?: File | string | null;
	onChange?: (file: File | null) => void;
	accept?: string;
	maxSizeMb?: number;
	error?: string;
	disabled?: boolean;
	className?: string;
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
	(
		{
			value,
			onChange,
			accept = 'image/jpeg,image/png,image/webp',
			maxSizeMb = 5,
			error,
			disabled = false,
			className,
		},
		ref
	) => {
		const [isDragging, setIsDragging] = useState(false);
		const [localError, setLocalError] = useState<string | null>(null);
		const inputRef = useRef<HTMLInputElement | null>(null);

		const previewUrl =
			value instanceof File ? URL.createObjectURL(value) : value || null;

		const handleFile = (file: File) => {
			setLocalError(null);
			if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
				setLocalError(`Файл превышает лимит ${maxSizeMb} МБ`);
				return;
			}
			onChange?.(file);
		};

		const handleDrop = (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
			if (disabled) return;
			const file = e.dataTransfer.files?.[0];
			if (file) handleFile(file);
		};

		const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFile(file);
		};

		const handleRemove = () => {
			if (inputRef.current) inputRef.current.value = '';
			onChange?.(null);
			setLocalError(null);
		};

		const displayError = error || localError;

		return (
			<div className={cn('flex flex-col gap-1.5 w-full', className)}>
				<div
					role='button'
					tabIndex={disabled ? -1 : 0}
					onClick={() => !disabled && inputRef.current?.click()}
					onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
						if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
							e.preventDefault();
							inputRef.current?.click();
						}
					}}
					onDragOver={(e) => {
						e.preventDefault();
						if (!disabled) setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDrop}
					className={cn(
						'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer select-none text-center outline-none min-h-36',
						isDragging
							? 'border-primary bg-surface-tag'
							: 'border-border-field hover:border-primary bg-surface-card',
						displayError && 'border-error',
						disabled &&
							'opacity-50 cursor-not-allowed border-border-subtle bg-surface-tag'
					)}>
					<input
						ref={(el) => {
							inputRef.current = el;
							if (typeof ref === 'function') ref(el);
							else if (ref) ref.current = el;
						}}
						type='file'
						accept={accept}
						disabled={disabled}
						onChange={handleChange}
						className='sr-only'
					/>

					{previewUrl ? (
						<div className='relative group'>
							<img
								src={previewUrl}
								alt='Превью'
								className='max-h-32 rounded-lg object-contain'
							/>
							{!disabled && (
								<button
									type='button'
									onClick={(e) => {
										e.stopPropagation();
										handleRemove();
									}}
									aria-label='Удалить изображение'
									className='absolute -top-2 -right-2 p-1 rounded-full bg-error text-secondary shadow-md hover:opacity-90 transition-opacity'>
									<X className='size-3.5' />
								</button>
							)}
						</div>
					) : (
						<>
							<UploadCloud className='size-8 text-placeholder mb-2' />
							<p className='text-sm font-medium text-foreground'>
								Нажмите или перетащите изображение сюда
							</p>
							<p className='text-xs text-placeholder mt-1'>
								PNG, JPG, WebP до {maxSizeMb} МБ
							</p>
						</>
					)}
				</div>
				{displayError && (
					<p role='alert' className='text-xs text-error font-text'>
						{displayError}
					</p>
				)}
			</div>
		);
	}
);

ImageUpload.displayName = 'ImageUpload';
