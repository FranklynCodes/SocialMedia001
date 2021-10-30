import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css"; // buggy?
// ! Check package.json folder location
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";
function App() {
	return (
		<AuthProvider>
			<Router>
				<Container>
					<MenuBar />
					<Route exact path="/" component={Home}></Route>
					{/* Passes down atributes such as exact, patch, component */}
					<AuthRoute exact path="/login" component={Login}></AuthRoute>
					<AuthRoute exact path="/register" component={Register}></AuthRoute>
				</Container>
			</Router>
		</AuthProvider>
	);
}

export default App;
