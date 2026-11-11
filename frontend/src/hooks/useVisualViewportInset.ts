'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
	const viewport = window.visualViewport;
	if (!viewport) return () => {};
	viewport.addEventListener('resize', onChange);
	viewport.addEventListener('scroll', onChange);
	return () => {
		viewport.removeEventListener('resize', onChange);
		viewport.removeEventListener('scroll', onChange);
	};
};

/** Сколько пикселей снизу окна перекрыто (экранная клавиатура, панели браузера). */
const getBottomInset = () => {
	const viewport = window.visualViewport;
	if (!viewport) return 0;
	return Math.max(
		0,
		Math.round(window.innerHeight - viewport.height - viewport.offsetTop)
	);
};

/**
 * Нижний отступ видимой области. Нужен, чтобы закреплённые снизу элементы
 * поднимались над клавиатурой: iOS Safari и Android Chrome при открытой
 * клавиатуре уменьшают только visualViewport, а `fixed bottom-0` остаётся под ней.
 */
export const useVisualViewportInset = () =>
	useSyncExternalStore(subscribe, getBottomInset, () => 0);
