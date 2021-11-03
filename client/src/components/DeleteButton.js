import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ postId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const [deletePost] = useMutation(DELETE_POST_MUTATION, {
		update(proxy) {
			// Once we reached the update we want to close the model
			setConfirmOpen(false);
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			//NOTE: Below REMOVE POST FROM CACHE, so change is reflected on the front end without having us having to FETCH post again
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,

				data: {
					getPosts: data.getPosts.filter((p) => p.id !== postId),
				},
			});

			if (callback) {
				callback();
			}
		},
		variables: {
			postId,
		},
	});
	return (
		<>
			<Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
				<Icon name="trash" style={{ margin: 0 }} />
			</Button>

			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePost}
			></Confirm>
		</>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deltePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;
export default DeleteButton;
