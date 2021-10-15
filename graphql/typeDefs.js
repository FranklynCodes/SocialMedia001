// Declares type schema for mongodb with sapollo 

const { gql } = require("apollo-server");

module.exports = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
	}
	type User {
		# Even if there is a required the user can still opt out from getting these data, however it MUST return from our resolver
		id: ID!
		email: String!
		token: String!
		username: String!
		createdAt: String!
	}

	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}

	type Query {
		getPosts: [Post]
	}
	type Mutation {
		# Change in db
		# input as arguments
		# Similar to function call
		# Returns a type of User
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
	}
`;

// # Gets all "Post" from our db and goes to collection post and bring all documents from there and returns it to user
