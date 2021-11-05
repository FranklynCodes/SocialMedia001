import React from "react";
import { Popup } from "semantic-ui-react";

// Pass in element for trigger prop
function MyPopup({ content, children }) {
	return <Popup inverted content={content} trigger={children}></Popup>;
}

export default MyPopup;
