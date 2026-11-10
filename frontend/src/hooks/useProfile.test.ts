import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useProfile } from './useProfile';
import { useProfileStore, useSubscriptions } from '@/store';

describe('useProfile', () => {
	beforeEach(() => {
		act(() => {
			useProfileStore.setState({
				profile: null,
				isAuth: false,
				isLoading: false,
			});
			useSubscriptions.setState({
				subscriptions: [],
			});
		});
	});

	it('возвращает объединенное состояние профиля и подписок без avatar/poster мутаций', () => {
		const { result } = renderHook(() => useProfile());

		expect(result.current.profile).toBeNull();
		expect(result.current.isAuth).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.subscriptions).toEqual([]);
		expect(typeof result.current.setProfile).toBe('function');
		expect(typeof result.current.updateProfile).toBe('function');
		expect(typeof result.current.logout).toBe('function');
		expect(typeof result.current.addSubscription).toBe('function');
		expect(typeof result.current.removeSubscription).toBe('function');

		// Декомпозиция: хук больше не содержит логику кадрирования и аватар/постер хэндлеров
		expect((result.current as Record<string, unknown>).crop).toBeUndefined();
		expect((result.current as Record<string, unknown>).zoom).toBeUndefined();
		expect(
			(result.current as Record<string, unknown>).handleChangeAvatar
		).toBeUndefined();
		expect(
			(result.current as Record<string, unknown>).handleLoadPoster
		).toBeUndefined();
	});

	it('обновляет профиль и подписки корректно', () => {
		const { result } = renderHook(() => useProfile());

		act(() => {
			result.current.setProfile({
				id: 'u1',
				username: 'testuser',
				email: 'test@example.com',
				avatarUrl: null,
				posterUrl: null,
				description: null,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				subscriptions: ['u2'],
				subscribers: [],
			});
			result.current.addSubscription('u2');
		});

		expect(result.current.isAuth).toBe(true);
		expect(result.current.profile?.username).toBe('testuser');
		expect(result.current.subscriptions).toEqual(['u2']);
	});
});
