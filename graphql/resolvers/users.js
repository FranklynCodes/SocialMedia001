const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput, validateLoginInput } = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{ expiresIn: "1h" }
	);
}

module.exports = {
	Mutation: {
		// Resolver arguments
		// Parents gives result of previous input from last step
		// Can have chained resolvers, which can get processed through different ways
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);

			if (!valid) {
				throw new UserInputError("Errors, See !valid ", { errors });
			}

			const user = await User.findOne({ username });
			if (!user) {
				// Not error for fields itself, general error
				errors.general = "User not found";
				throw new UserInputError("User not found", { errors });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				throw new UserInputError("Wrong crendetials", { errors });
			}
			// Give token after all if's
			const token = generateToken(user);

			return {
				// Spread data over users
				...user._doc,
				id: user._id,
				token,
			};
		},

		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } },
			context,
			info
		) {
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError("Error", { errors });
			}

			// TODO: Validate user Data, such as empty fields, password don't match, email already exists , see UTIL VALIDATORS 
			// TODO: Check if username is not duplicate, duplicate email is "ok"
			// TODO: Make sure user doesn't already exist

			// 2nd paramater/args = type Mutation{registerInput} (input RegisterInput)

			const user = await User.findOne({
				username,
			});
			// if (user === user) {
			// If user exists do x
			if (user) {
				throw new UserInputError("Username is taken", {
					errors: {
						// Payload
						username: "This username is taken",
					},
				});
			}
			// Hash password before storing in database and create a auth token

			password = await bcrypt.hash(password, 12); // 12 round encyption

			// call new User Model
			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save();

			const token = generateToken(res);
			return {
				// Spread data over users
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};
