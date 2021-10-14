// Holds details about schema using mongoose

const { model, Schema } = require("mongoose");

// Checking for validation/existence via GraphQL instead of mongoose
// https://mongoosejs.com/docs/validation.html

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createdAt: String,
});

module.exports = model("User", userSchema);
