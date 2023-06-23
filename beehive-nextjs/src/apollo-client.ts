import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';



const SERVER = 'http://localhost:4000'
//'https://beehive-graphql-api.onrender.com/'
//'http://localhost:4000'

const httpLink = createHttpLink({
  uri: SERVER,
});


// Create a middleware link to attach the token to each request
const authLink = setContext(async(_, { headers }) => {

  const session = await getSession()
  
  // Get the token from wherever it is stored (e.g., localStorage, state)
  const token = session?.user?.token || ''

  // Return the headers object with the Authorization header
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
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
