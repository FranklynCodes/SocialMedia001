const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
	Query: {
		async getPosts() {
			// Try catch to handle errors so server doesn't shutdown
			try {
				// .sort({ createdAt: -1 }) creates post in decneding order via mongoose
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getPost(_, { postId }) {
			try {
				const post = await Post.findById(postId);
				if (post) {
					return post;
				} else {
					throw new Error("Post not found");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
	},
	Mutation: {
		// Protected resolvers, User logs in and gets a protected authentication token then it get sents to a Authorization header, then send that header with the request and we need to get that token then decode it and get that information from it, to make sure that the user is autheticated to make sure the user is autheticated to make sure not anyone can create a post

		// People makes lots of mistakes of putting this authetication middleware for express itself that means it will run on EACH requests even on non-protected routes which is bad. See context arugment in global index.js for the method space/solves this

		// user will always be true here because checkAuth does our validation by the time were back in this file
		async createPost(_, { body }, context) {
			const user = checkAuth(context);
			console.log(user);

			// if (args.body.trim() === "") {
			if (body.trim() === "") {
				throw new Error("Post body must not be empty");
			}

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				createdAt: new Date().toISOString(),
			});

			const post = await newPost.save();

			return post;
		},
		async deletePost(_, { postId }, context) {
			// check if user is who they say they are, you don't want any user to delete there post
			const user = checkAuth(context);

			try {
				const post = await Post.findById(postId);
				if (user.username === post.username) {
					await post.delete();
					return "Post deleted successfully";
				} else {
					throw new AuthenticationError("Action not allowed");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		// Sometimes in CRUD you have to write the same code for different resources
		async likePost(_, { postId }, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if (post) {
				// A user can only have one like per post
				if (post.likes.find((like) => like.username)) {
					// Returns object
					// Post already liked, unlike it
					post.likes = post.likes.filter((like) => like.username !== username); // Leave all likes that do not match username, however remove the truty username likes
				} else {
					// Not liked, like post
					post.likes.push({
						username,
						createdAt: new Date().toISOString(),
					});
				}
				await post.save();
				return post;
			} else {
				throw new UserInputError("Post not found");
			}
		},
	},
};
