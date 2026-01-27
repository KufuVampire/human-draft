import { NextRequest, NextResponse } from 'next/server';

import { fetchMe } from './api';
import { routesConfig } from '@/config';

const authPages = [routesConfig.signin, routesConfig.signup];

export async function proxy(req: NextRequest) {
	const session = req.cookies.get(
		process.env.NEXT_PUBLIC_SESSION_NAME || 'h_draft_sid'
	)?.value;

	const url = req.nextUrl.clone();
	const isAuthPages = authPages.includes(url.pathname);

	try {
		const user = await fetchMe();

		if (isAuthPages && !session) {
			return NextResponse.next();
		}

		if (session && user) {
			return NextResponse.redirect(new URL(routesConfig.home, req.url));
		}
	} catch (error) {
		console.error(error);
	}
}

export const config = {
	matcher: ['/sign-in', '/sign-up'],
};
