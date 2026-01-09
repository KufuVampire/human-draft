'use client'

import { ApolloProvider } from '@apollo/client/react';
import { PropsWithChildren } from 'react';

import { apolloClient } from '@/libs';

export const ApolloClientProvider = ({ children }: PropsWithChildren) => {
	return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
