const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose"); // orm lib, lets us interface with mongoDB
const PORT = process.env.PORT || 5000;

const typeDefs = require("./graphql/typeDefs.js");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const server = new ApolloServer({
	typeDefs,
	resolvers,
	// Context req gets from express
	// fowards req into the context so that we can access it with in our context
	context: ({ req }) => ({ req }),
});

mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB Connected");
		return server.listen({ port: PORT });
	})
	.then((res) => {
		console.log(`Server running at ${res.url}`);
	})
	.catch((err) => {
		console.error(err);
	});
