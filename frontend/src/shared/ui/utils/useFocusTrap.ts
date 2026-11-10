import { RefObject, useEffect } from 'react';

const FOCUSABLE_ELEMENTS = [
	'a[href]',
	'area[href]',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'button:not([disabled])',
	'[tabindex="0"]',
];

export function useFocusTrap(
	containerRef: RefObject<HTMLElement | null>,
	isActive: boolean
) {
	useEffect(() => {
		if (!isActive || !containerRef.current) return;

		const container = containerRef.current;
		const previousActiveElement = document.activeElement as HTMLElement | null;

		const getFocusable = () =>
			Array.from(
				container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS.join(','))
			);

		const focusables = getFocusable();
		if (focusables.length > 0) {
			focusables[0].focus();
		} else {
			container.focus();
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;
			const elements = getFocusable();
			if (elements.length === 0) return;

			const first = elements[0];
			const last = elements[elements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			previousActiveElement?.focus();
		};
	}, [containerRef, isActive]);
}
