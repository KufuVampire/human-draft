'use client';

import { useEffect, useState } from 'react';

import { SubscribeButton, UnsubscribeButton } from '@/shared';
import { useProfile } from '@/hooks';

interface Props {
	toId: string;
	isSubscribed?: boolean;
	className?: string;
}

export const SubscribeUnsubscribeButtons = ({
	toId,
	isSubscribed = false,
	className,
}: Props) => {
	const [mounted, setMounted] = useState(false);
	const [isSubscribe, setSubscribe] = useState(isSubscribed);
	const { profile } = useProfile();

	useEffect(() => {
		if (!mounted) {
			setMounted(true);
		}
	}, [mounted]);

	useEffect(() => {
		if (!profile) {
			setSubscribe(false);
		}
	}, [profile]);

	if (!mounted) {
		return;
	}

	return !isSubscribe ? (
		<SubscribeButton
			toId={toId}
			setSubscribe={setSubscribe}
			className={className}
		/>
	) : (
		<UnsubscribeButton
			toId={toId}
			setSubscribe={setSubscribe}
			className={className}
		/>
	);
};
