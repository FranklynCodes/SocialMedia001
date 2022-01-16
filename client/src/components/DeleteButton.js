import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy) {
			// Once we reached the update we want to close the model
			setConfirmOpen(false);
			if (!commentId) {
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
			} else {
			}

			if (callback) {
				callback();
			}
		},
		variables: {
			postId,
			commentId,
		},
	});

	return (
		<>
			<MyPopup
				// REVIEW: Fix comment tab-accessability, on click go to input box 
				content={commentId ? "Delete comment" : "Delete Post"} // Review: If we have comment id that means were deleting a comment , post id is other
			>
				<Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
					<Icon name="trash" style={{ margin: 0 }} />
				</Button>
			</MyPopup>

			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			></Confirm>
		</>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;
export default DeleteButton;
