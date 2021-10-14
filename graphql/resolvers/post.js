const Post = require("../../models/Post");

module.exports = {
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
