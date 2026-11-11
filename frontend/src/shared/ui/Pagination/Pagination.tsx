import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/utils';

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	siblingCount?: number;
	className?: string;
}

export const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	siblingCount = 1,
	className,
}: PaginationProps) => {
	if (totalPages <= 1) return null;

	const generatePages = () => {
		const totalNumbers = siblingCount * 2 + 3;
		const totalBlocks = totalNumbers + 2;

		if (totalPages <= totalBlocks) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const leftSibling = Math.max(currentPage - siblingCount, 1);
		const rightSibling = Math.min(currentPage + siblingCount, totalPages);

		const showLeftDots = leftSibling > 2;
		const showRightDots = rightSibling < totalPages - 1;

		if (!showLeftDots && showRightDots) {
			const leftItemCount = 3 + 2 * siblingCount;
			const leftRange = Array.from(
				{ length: leftItemCount },
				(_, i) => i + 1
			);
			return [...leftRange, '...', totalPages];
		}

		if (showLeftDots && !showRightDots) {
			const rightItemCount = 3 + 2 * siblingCount;
			const rightRange = Array.from(
				{ length: rightItemCount },
				(_, i) => totalPages - rightItemCount + i + 1
			);
			return [1, '...', ...rightRange];
		}

		const middleRange = Array.from(
			{ length: rightSibling - leftSibling + 1 },
			(_, i) => leftSibling + i
		);
		return [1, '...', ...middleRange, '...', totalPages];
	};

	const pages = generatePages();

	return (
		<nav
			role='navigation'
			aria-label='Навигация по страницам'
			className={cn('flex items-center justify-center gap-1.5 select-none', className)}>
			<button
				type='button'
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
				aria-label='Предыдущая страница'
				className='size-9 flex items-center justify-center rounded-lg border border-border-subtle bg-surface-card text-foreground hover:bg-surface-tag disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'>
				<ChevronLeft className='size-4' />
			</button>

			{pages.map((page, idx) => {
				if (page === '...') {
					return (
						<span
							key={`dots-${idx}`}
							className='size-9 flex items-center justify-center text-placeholder text-sm'>
							...
						</span>
					);
				}

				const isCurrent = page === currentPage;

				return (
					<button
						key={`page-${page}`}
						type='button'
						onClick={() => onPageChange(Number(page))}
						aria-current={isCurrent ? 'page' : undefined}
						aria-label={`Страница ${page}`}
						className={cn(
							'size-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary',
							isCurrent
								? 'bg-primary text-on-primary font-bold shadow-sm'
								: 'border border-border-subtle bg-surface-card text-foreground hover:bg-surface-tag'
						)}>
						{page}
					</button>
				);
			})}

			<button
				type='button'
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				aria-label='Следующая страница'
				className='size-9 flex items-center justify-center rounded-lg border border-border-subtle bg-surface-card text-foreground hover:bg-surface-tag disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'>
				<ChevronRight className='size-4' />
			</button>
		</nav>
	);
};
