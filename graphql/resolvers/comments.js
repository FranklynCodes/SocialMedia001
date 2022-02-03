const { AuthenticationError, UserInputError } = require("apollo-server");

const checkAuth = require("../../util/check-auth");
const Post = require("../../models/Post");

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => {
			// ! Only need username instead of the whole json object user, see .unshift
			const { username } = checkAuth(context);
			if (body.trim() === "") {
				throw new UserInputError("Empty comment", {
					errors: {
						body: "Comment body must not be empty",
					},
				});
			}
			const post = await Post.findById(postId);

			if (post) {
				// Mongoose turns our data models into js objects
				post.comments.unshift({
					body: body, // swap later, used to store body of comments into database
					username,
					createdAt: new Date().toISOString(),
				});

				await post.save();
				return post;
			} else {
				// Tried to access a id that doesn't exists, usually client would handle this
				throw new UserInputError(
					"Post not found, Attempted to access a id that does not exist"
				);
			}
		},
		async deleteComment(_, { postId, commentId }, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if (post) {
				const commentIndex = post.comments.findIndex((c) => c.id === commentId); // Find comment index in the array comments then delete

				if ((post.comments[commentIndex].username = username)) {
					// Stops users from deleting anyones comments
					post.comments.splice(commentIndex, 1); // Start at commentIndex and remove just one
					await post.save();
					return post;
				} else {
					// Sometimes you don't need to send a payload with errors/show this on client because there will never be a delete button for a user that doesn't own that button
					// More of a saftey check / edge case, a user actually tries to delete a comment that isn't theres
					throw new AuthenticationError("Action not allowed");
				}
			} else {
				throw new UserInputError("Post not found");
			}
		},
	},
};
