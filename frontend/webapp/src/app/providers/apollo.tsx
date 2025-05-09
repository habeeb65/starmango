import React, { ReactNode } from 'react';
import { ApolloClient, ApolloProvider as BaseApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@sb/webapp-api-client';

interface ApolloProviderProps {
  children: ReactNode;
}

/**
 * ApolloProvider component to set up GraphQL client with authentication
 */
export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  const { getToken } = useAuth();
  
  // Create HTTP link to the GraphQL endpoint
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql',
    credentials: 'include',
  });
  
  // Set up the authentication link with JWT token
  const authLink = setContext(async (_, { headers }) => {
    const token = await getToken();
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  
  // Create Apollo client
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
  
  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
