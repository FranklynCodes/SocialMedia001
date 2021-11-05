import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
// import { FETCH_POSTS_QUERY } from "../util/graphql";
import {
	Button,
	Card,
	CardContent,
	Form,
	Grid,
	GridColumn,
	Icon,
	Image,
	Label,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/MyPopup";

function SinglePost(props) {
	const postId = props.match.params.postId; // Match url parameters
	const { user } = useContext(AuthContext);
	const commentInputRef = useRef(null);

	console.log("postId:", postId);

	const [comment, setComment] = useState("");

	const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	function deletePostCallback() {
		props.history.push("/");
	}
	const [sumbitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment("");
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	let postMarkup;
	if (!getPost) {
		postMarkup = <p>Loading post...</p>; // Add Spiner
	} else {
		const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost;
		postMarkup = (
			<Grid>
				<Grid.Row>
					<GridColumn width={2}>
						<Image
							src="https://react.semantic-ui.com/images/avatar/large/molly.png"
							size="small"
							float="right"
						></Image>
					</GridColumn>
					<GridColumn width={10}>
						<Card fluid>
							<CardContent>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</CardContent>
							<hr />
							<CardContent extra>
								<LikeButton
									user={user}
									post={{ id, likeCount, likes }}
								></LikeButton>
								<MyPopup content="Comment on Post">
									<Button
										as="div"
										labelPosition="right"
										onClick={() => {
											console.log("Comment on Post");
										}}
									>
										<Button basic color="blue">
											<Icon name="comments"></Icon>
										</Button>
										<Label basic color="blue" pointing="left">
											{commentCount}
										</Label>
									</Button>
								</MyPopup>

								{user && user.username === username && (
									<DeleteButton
										postId={id}
										callback={deletePostCallback}
									></DeleteButton>
								)}
							</CardContent>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment </p>
									<Form>
										<div className="ui action input fluid">
											<input
												type="text"
												placeholder="Comment..."
												value={comment}
												onChange={(event) => setComment(event.target.value)}
												ref={commentInputRef} // Can't ref semantic form directly since it is already a component
											></input>
											<Button
												type="sumbit"
												className="ui button teal"
												disabled={comment.trim() === ""}
												onClick={sumbitComment}
											>
												Sumbit Comment
											</Button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}

						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<CardContent>
									{user && user.username === comment.username && (
										<DeleteButton
											postId={id}
											commentId={comment.id}
										></DeleteButton>
									)}
									{/* Moments, if for ... */}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</CardContent>
							</Card>
						))}
					</GridColumn>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
	# mutation ($postId: ID!, $body: String!) { #TODO: See typdefs in apollo to match to ID instead of string, refactor bug#1
	mutation createComment($postId: String!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id # post id
			comments {
				id # comment id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query ($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default SinglePost;
