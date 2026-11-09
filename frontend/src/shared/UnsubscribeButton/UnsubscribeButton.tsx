'use client';

import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

import { Button } from '../Button/Button';

import { useUnsubscribeMutation } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { cn } from '@/utils';

interface Props {
	toId: string;
	setSubscribe: Dispatch<SetStateAction<boolean>>;
	className?: string;
}

export const UnsubscribeButton = ({ toId, setSubscribe, className }: Props) => {
	const t = useTranslations('btns');
	const { addSubscription, removeSubscription } = useProfile();

	const [unsubscribeMutation] = useUnsubscribeMutation({
		onError(err) {
			console.error(err);
			addSubscription(toId);
			setSubscribe(true);
			toast.error(t('unsubscribeError'));
		},
	});

	const handleClick = () => {
		unsubscribeMutation({
			variables: {
				toId,
			},
		});
		removeSubscription(toId);
		setSubscribe(false);
	};

	return (
		<Button
			variant='secondary'
			className={cn('dark:text-secondary', className)}
			onClick={handleClick}>
			{t('unsubscribe')}
		</Button>
	);
};
