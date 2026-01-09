import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import { API_URL } from '@/consts';

const httpLink = new HttpLink({
	uri: API_URL,
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});
