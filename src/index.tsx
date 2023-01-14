import React from 'react';
import ReactDOM from 'react-dom/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import './index.css';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

import { getMainDefinition } from '@apollo/client/utilities';
import App from './App';
import reportWebVitals from './reportWebVitals';

(async () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('messaging-user-token');
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null,
      },
    };
  });

  const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
  });
  const token = localStorage.getItem('messaging-user-token');

  const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:5000/subscription',
    connectionParams: {
      authentication: token ? `Bearer ${token}` : null,
    },
  }));

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition'
          && definition.operation === 'subscription'
      );
    },
    wsLink,
    // wsAuthLink.concat(wsLink),
    authLink.concat(httpLink),
  );
  const cache = new InMemoryCache({});

  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });

  const client = new ApolloClient({
    cache,
    link: splitLink,
    connectToDevTools: true,
  });

  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>,
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
})();
