import { cookies } from 'next/headers';

import { API_URL } from '@/consts';
import { UserModel } from '@/graphql/generated/output';

export async function fetchMe(): Promise<UserModel | null> {
	const cookieStore = await cookies();
	const allCookies = cookieStore.toString();

	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: allCookies,
			},
			body: JSON.stringify({
				query: `
          query Me {
            userProfile {
              id
							email
							username
							avatarUrl
							posterUrl
							createdAt
							updatedAt
            }
          }
        `,
			}),
			cache: 'no-cache',
		});

		const data = await res.json();

		return !('errors' in data) ? data.data.userProfile : null;
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
}
