const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

// Need secret key because we used it to verify the token so will need it to encode the token

module.exports = (context) => {
	// context = {...headers} will have objects, headers, etc...
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		// Bearer .... Convetion when working with tokens usually
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, SECRET_KEY);
				return user;
			} catch (err) {
				// TODO: Add blacklisting functionality
				throw new AuthenticationError("Invalid/Expired token");
			}
		}
		throw new Error("Authentication token must be 'Bearer [token]");
	}
	throw new Error("Authorization header must be provided");
};
