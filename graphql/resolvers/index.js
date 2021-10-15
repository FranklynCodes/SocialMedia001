const postsResolvers = require("./post");
const usersResolvers = require("./users");

module.exports = {
	Query: {
		...postsResolvers.Query,
	},
	Mutation: {
		...usersResolvers.Mutation,
	},
};
