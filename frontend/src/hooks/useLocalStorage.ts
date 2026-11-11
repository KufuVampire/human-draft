'use client';

import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useMemo,
	useState,
	useSyncExternalStore,
} from 'react';

// Событие для оповещения хуков в этой же вкладке (`storage` приходит только из других)
const LOCAL_STORAGE_EVENT = 'local-storage';

const subscribe = (onChange: () => void) => {
	window.addEventListener('storage', onChange);
	window.addEventListener(LOCAL_STORAGE_EVENT, onChange);
	return () => {
		window.removeEventListener('storage', onChange);
		window.removeEventListener(LOCAL_STORAGE_EVENT, onChange);
	};
};

const readRaw = (key: string) => {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.error(error, 'getItemLocalStorage');
		return null;
	}
};

const parse = <T>(raw: string | null, fallback: T): T => {
	if (raw === null) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch (error) {
		console.error(error, 'parseItemLocalStorage');
		return fallback;
	}
};

/**
 * Состояние, сохраняемое в localStorage.
 * На сервере и при гидратации отдаёт `initialValue`, поэтому разметка
 * сервера и клиента совпадает; сохранённое значение подставляется сразу после.
 */
export const useLocalStorage = <T>(
	key: string,
	initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
	// Фиксируем начальное значение: литерал `[]` в вызове — новый объект на каждом рендере
	const [fallback] = useState(initialValue);

	const raw = useSyncExternalStore(
		subscribe,
		() => readRaw(key),
		() => null
	);
	const value = useMemo(() => parse(raw, fallback), [raw, fallback]);

	const setValue = useCallback<Dispatch<SetStateAction<T>>>(
		(action) => {
			const prev = parse(readRaw(key), fallback);
			const next =
				typeof action === 'function'
					? (action as (prevState: T) => T)(prev)
					: action;
			try {
				localStorage.setItem(key, JSON.stringify(next));
			} catch (error) {
				console.error(error, 'setItemLocalStorage');
			}
			window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
		},
		[key, fallback]
	);

	return [value, setValue];
};
