import React, { useContext } from "react";
import gql from "graphql-tag";
import { useQuery, useQuery } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { Card, CardContent, Grid, GridColumn } from "semantic-ui-react";
import LikeButton from "../components/LikeButton";

import moment from "moment";
import { AuthContext } from "../context/auth";

function SinglePost(props) {
	const postId = props.match.parent.postId; // Match url parameters
	const { user } = useContext(AuthContext);
	console.log("postId:", postId);

	const {
		data: { getPost },
	} = useQuery(FETCH_POSTS_QUERY, {
		variables: {
			postId,
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
								<Card.Meta>{moment(createdAt.fromNow())}</Card.Meta>
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
							</CardContent>
						</Card>
					</GridColumn>
				</Grid.Row>
			</Grid>
		);
	}

	return <div></div>;
}

const FETCH_POST_QUERRY = gql`
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
