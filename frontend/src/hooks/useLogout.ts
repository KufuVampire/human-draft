'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useSignOutMutation } from '@/graphql/generated/output';
import { useProfileStore } from '@/store';

/** Выход из аккаунта: очищает профиль в сторе и завершает сессию на сервере. */
export const useLogout = () => {
	const t = useTranslations();
	const logout = useProfileStore((s) => s.logout);

	const [signOutMutation] = useSignOutMutation({
		onCompleted() {
			toast.success(t('logoutSuccess'));
		},
	});

	return useCallback(() => {
		logout();
		signOutMutation();
	}, [logout, signOutMutation]);
};
