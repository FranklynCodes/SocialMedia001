import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/react-hooks";
import { Button, Form } from "semantic-ui-react";

import { AuthContext } from "../context/auth.js";
import { useForm } from "../util/hooks.js";

function Register(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	// function onChange(event) {
	// Need to spread first or else will become overwritten
	// 	setValues({ ...values, [event.target.name]: event.target.value });
	// }

	// onChange = Need to spread first or else will become overwritten
	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	// array destrictomg
	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		// will triger on mutation execute
		update(_, { data: { register: userData } }) {
			context.login(userData);
			props.history.push("/");
		},
		onError(err) {
			// graphQLErrors, can get multiple errors but decided to do just one big error

			// https://github.com/dotansimha/graphql-code-generator/issues/3865 - exception deprecated  // setErrors(err.graphQLErrors[0].extensions.exception.errors); // - deprecated

			console.log(
				"err.graphQLErrors[0].extensions.errors:",
				err.graphQLErrors[0].extensions.errors
			);

			setErrors(err.graphQLErrors[0].extensions.errors); // Our server code we give, one error which contains all objects that hold those errors via array
		},
		variables: values, // OR variables: values,
		// Condensed into values since we want all the data and that has already been pre-spread
		// Errors are encapsulated in the error object
	});

	function registerUser() {
		// HOISTED - All javascript functions explicitly declared with functions at the begining of the program are HOISTED to the top of the script they are read through initally even if it is declared towards the bottom of the file as long as it has the function key word it is recognized up there.
		// You can kind of hack closures using this.

		addUser();
	}

	return (
		<div className="form-container">
			{/* // TODO: Warning: A component is changing an uncontrolled input to be controlled.  
			This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or 
			https://reactjs.org/docs/forms.html#controlled-components */}

			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
				<h1>Register</h1>

				<Form.Input
					label="Username"
					placeholder="Username..."
					name="username"
					type="text"
					value={values.username}
					error={errors.username ? true : false}
					onChange={onChange}
				></Form.Input>

				<Form.Input
					label="Email"
					placeholder="Email..."
					name="email"
					value={values.email}
					error={errors.email ? true : false}
					type="email"
					onChange={onChange}
				></Form.Input>

				<Form.Input
					label="Password"
					placeholder="Password..."
					name="password"
					value={values.password}
					error={errors.password ? true : false}
					onChange={onChange}
					type="password"
				></Form.Input>

				<Form.Input
					label="Confirm Password"
					placeholder="Confirm Password..."
					name="confirmPassword"
					type="password"
					value={values.confirmPassword}
					error={errors.confirmPassword ? true : false}
					onChange={onChange}
				></Form.Input>

				<Button type="sumbit" primary>
					Register
				</Button>
				{/* Errors all the time since must hold a variable, always a empty error pre-stored so have to LOOKUP if error object has any keys more then 0, which means it does have a error  */}
			</Form>

			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
