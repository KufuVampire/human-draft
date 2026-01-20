'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export const useActiveLink = () => {
	const pathname = usePathname();

	return useCallback(
		(href: string) => {
			const replacePathname = pathname.replace('/', '');
			if (replacePathname === href) {
				return true;
			}

			if (pathname === href) {
				return true;
			}

			return false;
		},
		[pathname]
	);
};
