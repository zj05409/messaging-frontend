import React from 'react';
import ReactDOM from 'react-dom/client';
import { setContext } from '@apollo/client/link/context';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
    ApolloClient,
    ApolloProvider, createHttpLink,
    InMemoryCache,
} from '@apollo/client'
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('reservation-user-token')
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : null,
        },
    }
})

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
