// Export JSX element
// Exporting Apolo Provider that wraps the entire application
// Could install apollo boost so it pre-does set up

import React from "react";
import App from "../App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context"; // https://www.npmjs.com/package/apollo-link-context - Works similar to a middlewear it setsContext to this request and edits it before sent to the http link

const httpLink = createHttpLink({
	uri: "http://localhost:5000",
});

const authLink = setContext((req, pre) => {
	const token = localStorage.getItem("jwtToken"); // Set as auth header
	return {
		// Will modifiy current request
		headers: {
			Authorization: token ? `Bearer ${token}` : "", // Merge headers of request with current exisiting headers
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink), // Adds the token to our request and succesfully send any protected api call
	cache: new InMemoryCache(), // Instantiates memory in cache
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
