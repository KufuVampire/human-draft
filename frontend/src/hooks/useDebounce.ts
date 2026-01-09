'use client'
import { useEffect, useState } from 'react';

export const useDebounce = (value: string, delay: number = 500) => {
	const [debounceValue, setDebounceValue] = useState<string>(value);
	useEffect(() => {
		const id = setTimeout(() => {
			setDebounceValue(value);
		}, delay);

		return () => clearTimeout(id);
	}, [delay, value]);

	return debounceValue;
};
