const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose"); // orm lib, lets us interface with mongoDB

const Post = require("./models/Post.js");

const { MONGODB } = require("./config.js");

const PORT = process.env.PORT || 5000;

const typeDefs = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
	}
	# Gets all "Post" from our db and goes to collection post and bring all documents from there and returns it to user
	type Query {
		getPosts: [Post]
	}
`;

const resolvers = {
	Query: {
		async getPosts() {
			// Try catch to handle errors so server doesn't shutdown
			try {
				const posts = await Post.find();
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
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
