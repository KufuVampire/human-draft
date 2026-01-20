import { cookies } from 'next/headers';

import { API_URL } from '@/consts';
import { UserModel } from '@/graphql/generated/output';

const profileQuery = `
	query me {
		userProfile {
			username
			id
			email
			description
			posterUrl
			avatarUrl
			createdAt
			updatedAt
			subscribers
			subscriptions
			posts {
				id
				author {
					id
					username
				}
				content
				tags {
					id
					name
				}
				createdAt
				updatedAt
				likesCount
				viewsCount
				comments {
					id
					text
					replies {
						id
						text
						updatedAt
						createdAt
					}
					createdAt
					updatedAt
				}
				commentsCount
			}
			blogs {
				id
				title
				author {
					id
					username
				}
				description
				tags {
					id
					name
				}
				createdAt
				updatedAt
			}
		}
	}
`;

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
				query: profileQuery,
			}),
			cache: 'no-cache',
		});

		if (!res.ok) {
			console.error('Server error:', res.status);
			return null;
		}

		const data = await res.json();

		return !('errors' in data) ? data.data.userProfile : null;
	} catch (error) {
		console.error('Error fetching user data:', error);
		return null;
	}
}
