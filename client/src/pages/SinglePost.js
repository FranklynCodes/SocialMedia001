import React, { useContext } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
// import { FETCH_POSTS_QUERY } from "../util/graphql";
import { Button, Card, CardContent, Grid, GridColumn, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
	const postId = props.match.params.postId; // Match url parameters
	const { user } = useContext(AuthContext);
	console.log("postId:", postId);

	const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	function deletePostCallback() {
		props.history.push("/");
	}

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
								{user && user.username === username && (
									<DeleteButton
										postId={id}
										callback={deletePostCallback}
									></DeleteButton>
								)}
							</CardContent>
						</Card>
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
