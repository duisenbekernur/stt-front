import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Создаем HTTP линк без авторизации
const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql', // URL вашего GraphQL сервера
});

// Создаем Apollo Client
export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
});