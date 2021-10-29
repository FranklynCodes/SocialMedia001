import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

function Home() {
	const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY); // Careful posts can be null or undefined, create a case for that

	return (
		<Grid columns={3}>
			{/* Watch out for specificailty issues */}
			<Grid.Row id="page-title">
				<h1>Recent Posts</h1>
			</Grid.Row>
			<Grid.Row>
				{loading ? (
					<h1>Loading posts..</h1>
				) : (
					// posts = data, data converted to post, passed down as props to Components
					posts &&
					posts.map((post) => (
						<Grid.Column key={post.id} style={{ marginBottom: 20 }}>
							<PostCard post={post} />
						</Grid.Column>
					))
				)}
			</Grid.Row>
		</Grid>
	);
}

const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
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

export default Home;