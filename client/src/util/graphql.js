import gql from "graphql-tag";
// https://graphql.org/learn/queries/
export const FETCH_POSTS_QUERY = gql`
	query getPosts {
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
