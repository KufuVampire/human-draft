import { ApolloClient, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

import { API_URL } from '@/consts';

const httpLink = createUploadLink({
	uri: API_URL,
	credentials: 'include',
	headers: {
		'apollo-require-preflight': 'true',
	},
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});
