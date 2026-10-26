import { NextRequest, NextResponse } from 'next/server';

import { routesConfig } from '@/config';

const SESSION_COOKIE_NAME =
	process.env.NEXT_PUBLIC_SESSION_NAME ||
	process.env.SESSION_NAME ||
	'h_draft_sid';

export const isAuthRoute = (pathname: string): boolean => {
	return pathname === routesConfig.signin || pathname === routesConfig.signup;
};

export const isProtectedRoute = (pathname: string): boolean => {
	if (pathname === '/post/create' || pathname.startsWith('/post/create/')) {
		return true;
	}
	if (/^\/post\/[^/]+\/update(?:\/.*)?$/.test(pathname)) {
		return true;
	}
	if (pathname === '/blog/create' || pathname.startsWith('/blog/create/')) {
		return true;
	}
	if (/^\/blog\/[^/]+\/update(?:\/.*)?$/.test(pathname)) {
		return true;
	}
	if (/^\/[^/]+\/settings(?:\/.*)?$/.test(pathname)) {
		return true;
	}
	return false;
};

export function proxy(req: NextRequest) {
	const session = req.cookies.get(SESSION_COOKIE_NAME)?.value;
	const { pathname } = req.nextUrl;

	if (session && isAuthRoute(pathname)) {
		return NextResponse.redirect(new URL(routesConfig.home, req.url));
	}

	if (!session && isProtectedRoute(pathname)) {
		return NextResponse.redirect(new URL(routesConfig.signin, req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)',
	],
};
