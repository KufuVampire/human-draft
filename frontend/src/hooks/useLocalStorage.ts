'use client'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

export const useLocalStorage = <T>(
	key: string,
	initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
	const getItem = (): T => {
		try {
			if (typeof window === 'undefined') return initialValue;
			const item = localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	};

	const [storedValue, setStoredValue] = useState<T>(() => getItem());

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(storedValue));
		} catch (error) {
			console.error(error);
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
};
