'use client';

import { useEffect, useState } from 'react';

export const useBlobUrl = (
	file: File | Blob | null | undefined
): string | null => {
	const [blobUrl, setBlobUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!file) {
			setBlobUrl(null);
			return;
		}

		const url = URL.createObjectURL(file);
		setBlobUrl(url);

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [file]);

	return blobUrl;
};
