import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { GRAPHQL_URL } from '../config/api';

/**
 * Create an error link for Apollo client
 * This handles GraphQL errors and network errors
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

/**
 * Create an HTTP link for Apollo client
 * This configures the GraphQL endpoint
 */
const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include', // Include cookies for authentication
});

/**
 * Create an auth link for Apollo client
 * This adds authentication headers to GraphQL requests
 */
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from local storage
  const token = localStorage.getItem('starmango_access_token');
  
  // Get the current tenant ID for multi-tenant isolation
  const tenantId = localStorage.getItem('starmango_current_tenant');
  
  // Add authentication and tenant context headers
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'X-Tenant-ID': tenantId || '',
    },
  };
});

/**
 * Create the Apollo client
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
