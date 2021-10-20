import React, { useState } from "react";
import { Menu, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

function MenuBar() {
	const pathname = window.location.pathname;

	// Terniary operatior variation const path = pathname === '/' ? 'home' : pathname.substr(1);
	function findPath(pathname) {
		if (pathname === "/") {
			return "home";
		} else {
			return pathname.substring(1);
		}
	}
	const path = findPath(pathname);

	const [activeItem, setActiveItem] = useState(path); // active similar to onclick js

	// state = { activeItem: "home" };
	// const { activeItem } = this.state; // removable

	const handleItemClick = (e, { name }) => setActiveItem(name); // could change to arrow fnc

	return (
		<div>
			<Menu pointing secondary size="massive" color="teal">
				<Menu.Item
					name="home"
					active={activeItem === "home"}
					onClick={handleItemClick}
					as={Link}
					to="/"
				/>
				<Menu.Menu position="right">
					<Menu.Item
						name="login"
						active={activeItem === "login"}
						onClick={handleItemClick}
						as={Link}
						to="/login"
					/>
					<Menu.Item
						name="register"
						active={activeItem === "register"}
						onClick={handleItemClick}
						as={Link}
						to="/register"
					/>
				</Menu.Menu>
			</Menu>

			{/* <Segment>
					<img src="/images/wireframe/media-paragraph.png" />
				</Segment> */}
		</div>
	);
}

export default MenuBar;
