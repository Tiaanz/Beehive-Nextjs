import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { config } from 'dotenv'
config()
// const client = new ApolloClient({
//   uri: 'http://localhost:4000',
//   cache: new InMemoryCache(),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: 'cache-and-network',
//     },
//   },
// })

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});


// Create a middleware link to attach the token to each request
const authLink = setContext((_, { headers }) => {
  // Get the token from wherever it is stored (e.g., localStorage, state)
  const token = 'beehiveSecret*'

  // Return the headers object with the Authorization header
  return {
    headers: {
      ...headers,
      authentication: token ? ` ${token}` : '',
    },
  }
})

// Create the Apollo Client instance with the configured links and cache
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export default client
