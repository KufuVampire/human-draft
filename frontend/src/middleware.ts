import { NextRequest, NextResponse } from 'next/server';

import { routesConfig } from './config';

const authPages = [routesConfig.signin, routesConfig.signup];

export async function middleware(req: NextRequest) {
	const session = req.cookies.get(
		process.env.NEXT_PUBLIC_SESSION_NAME || 'h_draft_sid'
	)?.value;

	const url = req.nextUrl.clone();
	const isAuthPages = authPages.includes(url.pathname);

	if (isAuthPages) {
		if (session) {
			return NextResponse.redirect(new URL(routesConfig.home, req.url));
		}

		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		'/sign-in',
		'/sign-up',
		'/post/create',
		'/blog/create',
	],
};
