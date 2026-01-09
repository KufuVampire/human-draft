import { API_URL } from '@/consts';
import { TypeUserProfile } from '@/schemas';

export async function fetchMe(
	token: string | undefined
): Promise<TypeUserProfile | null> {
	if (!token) {
		throw new Error('Failed to fetch user data');
	}

	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				query: `
          query Me {
            me {
              id
							email
							username
							avatarUrl
							blocked
							role {
								name
							}
							confirmed
							createdAt
							updatedAt
            }
          }
        `,
			}),
		});

		const data = await res.json();
		console.log(data)

		return data?.data?.me ?? null;
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
}
