import React, { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/react-hooks";
import { Button, Form } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

function Login(props) {
	const context = useContext(AuthContext); // Did not destructure the login here because would become unreadable to many login keywords
	const [errors, setErrors] = useState({});

	// onChange = Need to spread first or else will become overwritten
	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		username: "",
		password: "",
	});

	// array destructing
	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		// will triger on mutation execute
		update(_, { data: { login: userData } }) {
			// ! Need to hit this function first in order to pass the userdata held from the context variable
			//console.log("userData:", userData);
			context.login(userData);
			props.history.push("/");
		},
		onError(err) {
			// graphQLErrors, can get multiple errors but decided to do just one big error

			// https://github.com/dotansimha/graphql-code-generator/issues/3865 - exception deprecated  // setErrors(err.graphQLErrors[0].extensions.exception.errors); // - deprecated

			//console.log("err.graphQLErrors[0].extensions.errors:", err.graphQLErrors[0].extensions.errors);

			setErrors(err.graphQLErrors[0].extensions.errors); // Our server code we give, one error which contains all objects that hold those errors via array
		},
		variables: values, // OR variables: values,
		// Condensed into values since we want all the data and that has already been pre-spread
	});

	function loginUserCallback() {
		loginUser();
	}
	// Errors are encapsulated in the error object

	return (
		<div className="form-container">
			{/* // TODO: Warning: A component is changing an uncontrolled input to be controlled.  
			This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or 
			https://reactjs.org/docs/forms.html#controlled-components */}

			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
				<h1>Login</h1>

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
					label="Password"
					placeholder="Password..."
					name="password"
					value={values.password}
					error={errors.password ? true : false}
					onChange={onChange}
					type="password"
				></Form.Input>

				<Button type="sumbit" primary>
					Login
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

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
