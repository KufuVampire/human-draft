'use client';

import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

import { Button } from '../Button/Button';

import { useSubscribeMutation } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { useModalStore } from '@/store';

interface Props {
	toId: string;
	setSubscribe: Dispatch<SetStateAction<boolean>>;
	className?: string;
}

export const SubscribeButton = ({ toId, setSubscribe, className }: Props) => {
	const t = useTranslations('btns');
	const { profile, addSubscription, removeSubscription } = useProfile();
	const openModal = useModalStore((s) => s.openModal);

	const [subscribeMutation] = useSubscribeMutation({
		onError(err) {
			console.error(err);
			removeSubscription(toId);
			setSubscribe(false);
			toast.error(t('subscribeError'));
		},
	});

	const handleClick = () => {
		if (!profile) {
			openModal('needAuth');
			return;
		}
		subscribeMutation({
			variables: {
				toId,
			},
		});
		addSubscription(toId);
		setSubscribe(true);
	};

	return (
		<Button
			className={className}
			onClick={handleClick}>
			{t('subscribe')}
		</Button>
	);
};
