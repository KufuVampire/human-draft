import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { isAuthRoute, isProtectedRoute, proxy } from './proxy';

const createMockRequest = (
	pathname: string,
	options: { sessionCookie?: string } = {}
): NextRequest => {
	const url = `http://localhost:3000${pathname}`;
	const headers = new Headers();

	if (options.sessionCookie) {
		headers.set('cookie', `h_draft_sid=${options.sessionCookie}`);
	}

	return new NextRequest(url, { headers });
};

describe('proxy helper functions', () => {
	it('identifies authentication routes correctly', () => {
		expect(isAuthRoute('/sign-in')).toBe(true);
		expect(isAuthRoute('/sign-up')).toBe(true);
		expect(isAuthRoute('/')).toBe(false);
		expect(isAuthRoute('/users')).toBe(false);
		expect(isAuthRoute('/post/create')).toBe(false);
	});

	it('identifies protected routes correctly', () => {
		expect(isProtectedRoute('/post/create')).toBe(true);
		expect(isProtectedRoute('/post/create/blog-123')).toBe(true);
		expect(isProtectedRoute('/post/post-abc/update')).toBe(true);
		expect(isProtectedRoute('/blog/create')).toBe(true);
		expect(isProtectedRoute('/blog/blog-abc/update')).toBe(true);
		expect(isProtectedRoute('/johndoe/settings')).toBe(true);

		// Public routes should NOT be protected
		expect(isProtectedRoute('/')).toBe(false);
		expect(isProtectedRoute('/users')).toBe(false);
		expect(isProtectedRoute('/johndoe')).toBe(false);
		expect(isProtectedRoute('/post/post-abc')).toBe(false);
		expect(isProtectedRoute('/blog/blog-abc')).toBe(false);
		expect(isProtectedRoute('/sign-in')).toBe(false);
		expect(isProtectedRoute('/sign-up')).toBe(false);

		// System routes with settings subpath should NOT be matched as user settings
		expect(isProtectedRoute('/users/settings')).toBe(false);
		expect(isProtectedRoute('/about-us/settings')).toBe(false);
	});
});

describe('proxy execution and redirects', () => {
	it('redirects authenticated user away from /sign-in to /', () => {
		const req = createMockRequest('/sign-in', { sessionCookie: 'valid-session' });
		const response = proxy(req);

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('http://localhost:3000/');
	});

	it('redirects authenticated user away from /sign-up to /', () => {
		const req = createMockRequest('/sign-up', { sessionCookie: 'valid-session' });
		const response = proxy(req);

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('http://localhost:3000/');
	});

	it('allows user with stale cookie to access /sign-in?expired=true and deletes cookie', () => {
		const req = createMockRequest('/sign-in?expired=true', {
			sessionCookie: 'stale-session',
		});
		const response = proxy(req);

		expect(response.headers.get('location')).toBeNull();
		expect(response.status).toBe(200);
		// Cookie is removed
		const setCookie = response.headers.get('set-cookie');
		expect(setCookie).toContain('h_draft_sid=;');
	});

	it('allows user with stale cookie to access /sign-in?logout=true and deletes cookie', () => {
		const req = createMockRequest('/sign-in?logout=true', {
			sessionCookie: 'stale-session',
		});
		const response = proxy(req);

		expect(response.headers.get('location')).toBeNull();
		expect(response.status).toBe(200);
		const setCookie = response.headers.get('set-cookie');
		expect(setCookie).toContain('h_draft_sid=;');
	});

	it('redirects unauthenticated user from protected /post/create to /sign-in', () => {
		const req = createMockRequest('/post/create');
		const response = proxy(req);

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in');
	});

	it('redirects unauthenticated user from protected /username/settings to /sign-in', () => {
		const req = createMockRequest('/alice/settings');
		const response = proxy(req);

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in');
	});

	it('redirects unauthenticated user from protected /blog/123/update to /sign-in', () => {
		const req = createMockRequest('/blog/123/update');
		const response = proxy(req);

		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('http://localhost:3000/sign-in');
	});

	it('allows authenticated user to access protected routes', () => {
		const req = createMockRequest('/post/create', { sessionCookie: 'valid-session' });
		const response = proxy(req);

		expect(response.headers.get('location')).toBeNull();
		expect(response.status).toBe(200);
	});

	it('allows unauthenticated user to access public routes', () => {
		const req = createMockRequest('/');
		const response = proxy(req);

		expect(response.headers.get('location')).toBeNull();
		expect(response.status).toBe(200);
	});

	it('allows unauthenticated user to access public system subpaths', () => {
		const req = createMockRequest('/users/settings');
		const response = proxy(req);

		expect(response.headers.get('location')).toBeNull();
		expect(response.status).toBe(200);
	});
});
