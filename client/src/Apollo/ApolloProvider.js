// Export JSX element
// Exporting Apolo Provider that wraps the entire application
// Could install apollo boost so it pre-does set up

import React from "react";
import App from "../App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
// import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
	uri: "http://localhost:5000",
});

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(), // Instanciates in memory cachce
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
