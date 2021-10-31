const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
	// If change any of the field, each time a querry, mutation or a subscription occurs it will go through the Post modifers and apply them. Kind of like middlewear, Post func has a higher order of precidence
	Post: {
		// likeCount:(parent) // parent holds data from previous steps
		// might have to swap this to arrow notation, cut the return
		likeCount(parent) {
			console.log("parent:", parent); // Prints out last POST data
			return parent.likes.length;
		},
		commentCount: (parent) => parent.comments.length,
	},
	Query: {
		...postsResolvers.Query,
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postsResolvers.Mutation,
		...commentsResolvers.Mutation,
	},
};
