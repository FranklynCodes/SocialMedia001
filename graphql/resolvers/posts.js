const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
	Query: {
		async getPosts() {
			//console.log("getPosts\n:"); // To check when resolvers are being hit

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
			//console.log("getPosts\n:"); // To check when resolvers are being hit
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
		// Protected resolvers, User logs in and gets a protected authentication token then it get sents to a Authorization header, then sends that header with the request and we need to get that token, to decode for information to make sure that the user is autheticated so not anyone can create a post

		// People makes lots of mistakes of putting this authetication middleware for express itself that means it will run on EACH requests even on non-protected routes which is bad. See context arugment in global index.js for the method space/solves this

		// user will always be true here because checkAuth does our validation by the time were back in this file ? Cant l comment this out
		async createPost(_, { body }, context) {
			//console.log("createPost:Start\n"); // To check when resolvers are being hit
			const user = checkAuth(context);
			//console.log("createPost:", user);

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
			//console.log("deletePost:ResolverHit\n");

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

				// Search through postID array to find if there is a like value associated to the username currently logged in if there is not a liked value associated to current logged in user. Focus on if a like ITSELF EXISTS to do associated user within that postID

				// (like) => like.username === username) = Return truty value if logged in user has liked OR not liked the post default is false.

				if (post.likes.find((like) => like.username === username)) {
					console.log("username:", username);
					// Returns object
					// Post already liked, unlike it
					console.log("post.likes:", post.likes);
					post.likes = post.likes.filter((like) => like.username !== username);
					console.log("post.likes:", post.likes);
					// Leave all likes that do not match username, however remove the truty username likes
				} else {
					// Not liked, like post
					post.likes.push({
						username,
						createdAt: new Date().toISOString(),
					});
					console.log("AAApost.likes:", post.likes);
				}
				await post.save();
				return post;
			} else {
				throw new UserInputError("Post not found");
			}
		},
	},
};
