const { model, Schema } = require("mongoose");

// Possible to create default values here but instead will fully have GraphQL resolvers manage the default values
// ppst Schema = individual property 
const postSchema = new Schema({
	body: String,
	username: String,
	createdAt: String,
	comments: [
		{
			body: String,
			username: String,
			createdAt: String,
		},
	],
	likes: [
		{
			username: String,
			createdAt: String, // For analytics
		},
	],
	user: {
		// https://mongoosejs.com/docs/schematypes.html
		type: Schema.Types.ObjectId,
		ref: `users`, // passed in users table so that we can in the future can populate this field with mongoose methods
	},
});

module.exports = model("Post", postSchema);
