import {
	PropsWithChildren,
	ReactNode,
	useId,
	useRef,
	useState,
} from 'react';

import { cn } from '@/utils';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
	content: ReactNode;
	placement?: TooltipPlacement;
	delay?: number;
	className?: string;
}

export const Tooltip = ({
	content,
	placement = 'top',
	delay = 150,
	className,
	children,
}: PropsWithChildren<TooltipProps>) => {
	const [isVisible, setIsVisible] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const tooltipId = useId();

	const show = () => {
		if (delay <= 0) {
			setIsVisible(true);
			return;
		}
		timerRef.current = setTimeout(() => setIsVisible(true), delay);
	};

	const hide = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setIsVisible(false);
	};

	const placementClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2',
	};

	return (
		<div
			aria-describedby={isVisible ? tooltipId : undefined}
			onMouseEnter={show}
			onMouseLeave={hide}
			onFocus={show}
			onBlur={hide}
			className='relative inline-flex items-center'>
			{children}
			{isVisible && (
				<div
					id={tooltipId}
					role='tooltip'
					className={cn(
						'absolute z-dropdown px-2.5 py-1 text-xs font-medium rounded-lg bg-layout text-secondary shadow-md pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95',
						placementClasses[placement],
						className
					)}>
					{content}
				</div>
			)}
		</div>
	);
};
