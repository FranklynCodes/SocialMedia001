import React, { createContext, useReducer } from "react";

import jwtDecode from "jwt-decode";
// Only using useContext since the app is small, Not nessesary to use Redux
// useReducer, recieves a type of action and a payload then it determines what it is going to use with the payload depending on the functionality of your application
const initialState = {
	user: null,
};

if (localStorage.getItem("jwtToken")) {
	const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
	// Stores expiration date
	// Check If 1 hr token is expired, if true reject that login token then return use to the login page.
	// Need to decode expiration value out of the token

	if (decodedToken.exp * 1000 < Date.now()) {
		localStorage.removeItem("jwtToken");
	} else {
		initialState.user = decodedToken;
	}
}
const AuthContext = createContext({
	user: null,
	login: (userData) => {},
	logout: () => {},
});

function authReducer(state, action) {
	switch (action.type) {
		case "LOGIN": // Normal to have const variables but since only two we will be in strings //TODO: Swap to variables
			return {
				...state,
				user: action.payload, // Getting data then allocates data to user variable state
			};
		case "LOGOUT": {
			return {
				...state,
				user: null,
			};
		}

		default:
			return state;
	}
}

function AuthProvider(props) {
	const [state, dispatch] = useReducer(authReducer, initialState); // Use this to dispatch any action then attach this to any type or payload then when that is dispatched the reducer will listen to it for changes and preform according action

	function login(userData) {
		localStorage.setItem("jwtToken", userData.token);
		dispatch({
			type: "LOGIN",
			payload: userData,
		});
	}
	function logout() {
		localStorage.removeItem("jwtToken");
		dispatch({
			type: "LOGOUT",
		});
	}

	return (
		<AuthContext.Provider
			value={{ user: state.user, login, logout }}
			{...props}
		></AuthContext.Provider>
	);
}

export { AuthContext, AuthProvider }; // AuthProvider is our react compoenent wrapper
