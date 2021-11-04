// Declares type schema for mongodb with sapollo

const { gql } = require("apollo-server");

module.exports = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
		# If you have a ! inside the [] that means that there there must be at least one element in the array
		# comments:[Comment!]!
		comments: [Comment!]!
		likes: [Like]!
		# Calcing ttl num of comments and likes, via server instead of client, to mimizime the ammount of computation that is happening on the client
		# Sends through modiferis instead of mutation
		likeCount: Int!
		commentCount: Int!
	}

	type Comment {
		id: ID!
		createdAt: String!
		username: String!
		body: String!
	}
	type Like {
		id: ID!
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
		# //~ querry called getPots which takes postID: of type ID which is required and will return Post
		getPost(postId: ID!): Post
	}
	type Mutation {
		# Change in db
		# input as arguments
		# Similar to function call
		# Returns a type of User
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		createPost(body: String!): Post!
		deletePost(postId: ID!): String!
		# Post ID

		#TODO: createComment(postId: ID!, body: String!): Post! #Make this true, refactor code
		createComment(postId: String!, body: String!): Post! #  Change postId string type to type of ID bug#1
		# Takes both postid and commentid | if post is deleted, delete all comments
		# To avoid issue of looking up comment when post is already deleted or the inverse looking up a post to find a comment but it has already been deleted
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post! # Toggle to adjust your like from +1 or 0
	}
`;

// # Gets all "Post" from our db and goes to collection post and bring all documents from there and returns it to user
