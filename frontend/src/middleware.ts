import { NextRequest, NextResponse } from 'next/server';

import { fetchMe } from './api';
import { routesConfig } from './config';

const authPages = [routesConfig.signin, routesConfig.signup];

export async function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;

	if (!token) return NextResponse.next();

	try {
		const data = await fetchMe(token);

		if (data) {
			const url = req.nextUrl.clone();
			const referer = req.headers.get('referer');

			if (authPages.includes(url.pathname)) {
				return NextResponse.redirect(new URL(routesConfig.home, req.url));
			}

			if (referer) {
				const prev = new URL(referer);
				if (!authPages.includes(prev.pathname)) {
					url.pathname = prev.pathname;
					url.search = prev.search;
					return NextResponse.redirect(url);
				}
			}

			return NextResponse.next();
		}
	} catch (error) {
		console.error('Auth check failed:', error);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/sign-in',
		'/sign-up',
		'/blog/:blogId/edit',
		'/post/:postId/edit',
		'/post/create',
		'/blog/create',
	],
};
