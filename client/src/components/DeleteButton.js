import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

function DeleteButton({ postId }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const [deletePost] = useMutation(DELETE_POST_MUTATION, {
		update() {
			// Once we reached the update we want to close the model
			setConfirmOpen(false);
			// TODO: REMOVE POST FROM CACHE, so change is reflected on he fornt end without having us having to FETCH post again
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
