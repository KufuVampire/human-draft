'use client'
import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number = 500): T => {
	const [debounceValue, setDebounceValue] = useState<T>(value);
	useEffect(() => {
		const id = setTimeout(() => {
			setDebounceValue(value);
		}, delay);

		return () => clearTimeout(id);
	}, [delay, value]);

	return debounceValue;
};
