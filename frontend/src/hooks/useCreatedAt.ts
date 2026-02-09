import { useFormatter, useTranslations } from 'next-intl';

export const useCreateAt = (date: string) => {
	const t = useTranslations();
	const intl = useFormatter();
	const postCreatedAtDate = new Date(date);
	const datePart = intl.dateTime(postCreatedAtDate, {
		day: 'numeric',
		month: 'short',
	});

	const timePart = intl.dateTime(postCreatedAtDate, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	return `${datePart} ${t('in')} ${timePart}`;
};
