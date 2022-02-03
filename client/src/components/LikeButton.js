import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";
import MyPopup from "../util/MyPopup";

// Need to access user here. We can do that by importing the context
function LikeButton({ user, post: { id, likeCount, likes } }) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			// if any of the likes on this posts have a username of this user that means that this user we are logged in as will like this post
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]); // Dependancy array, if any of these change recalculate the value

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	}); // could have error but that would only related to token expiration

	const likeButton = user ? (
		liked ? (
			<Button color="teal">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="teal" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} to="/login" color="teal" basic>
			<Icon name="heart" />
		</Button>
	);

	// Break on edge case of user not logged in
	// return (
	// 	<Button as="div" labelPosition="right" onClick={likePost}>
	// 		<MyPopup content={liked ? "Unlike" : "Like"}>{likeButton}</MyPopup>
	// 		<Label basic color="teal" pointing="left">
	// 			{likeCount}
	// 		</Label>
	// 	</Button>
	// );

	// TODO: Highlight login button and GIVE error message, explain why you have to login first to user in UI
	// diff
	return user ? (
		<Button as="div" labelPosition="right" onClick={likePost}>
			<MyPopup content={liked ? "Unlike Post" : "Like Post"}>{likeButton}</MyPopup>
			<Label basic color="teal" pointing="left">
				{likeCount}
			</Label>
		</Button>
	) : (
		<Button labelPosition="right" as="a" href="/login">
			<MyPopup content={liked ? "Unlike Post" : "Like Post"}>{likeButton}</MyPopup>
			<Label basic color="teal" pointing="left">
				{likeCount}
			</Label>
		</Button>
	);
}
// ! Id is updating without proxy, because we are directly referencing the id and getting back a resouce of type post, apollo can understand that since it post type and post id it will update the post that contains both of these variables and update it using the given fields

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
