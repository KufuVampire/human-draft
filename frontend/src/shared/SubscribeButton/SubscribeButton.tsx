'use client';

import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';

import { Button } from '../Button/Button';

import { useSubscribeMutation } from '@/graphql/generated/output';
import { useProfile } from '@/hooks';
import { useNeedAuthModal } from '@/store';

interface Props {
	toId: string;
	setSubscribe: Dispatch<SetStateAction<boolean>>;
	className?: string;
}

export const SubscribeButton = ({ toId, setSubscribe, className }: Props) => {
	const t = useTranslations('btns');
	const [subscribeMutation] = useSubscribeMutation();
	const { profile, addSubscription } = useProfile();
	const { setOpen } = useNeedAuthModal();

	const handleClick = () => {
		if (!profile) {
			setOpen(true);
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
