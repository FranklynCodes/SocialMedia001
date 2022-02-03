import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";

import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: "",
	}); // createpost = callback

	// For register and login section we used on error method then set them to local errors but here it doesn't make sense
	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		// ! Querrys are not being constantly being sent to server, it may seem so but it is limited to being sent only to the client side cacche.
		// ! Apollo querry output will show several queries but our server is not receiving all of those query only the 1st getPosts is being sent to the server, do not worry about overloading your server in this condition
		// | Learn apollo local caching query and server connection
		update(proxy, result) {
			// ~ See posts.js ! comments
			// ? How do l delete cache? How do l directly access cache and modify it? How do l use graphql querry on our existing data
			//console.log("PostForm\tresult:", result);

			// ! Inside variable getPosts, all this data is scoped inside getPosts, it is the rootQuerry
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
				variables: values,
			});
			data.getPosts = [result.data.createPost, ...data.getPosts];
			proxy.writeQuery({ query: FETCH_POSTS_QUERY, variables: values, data });
			values.body = "";
		},
		onError(error) {
			return error;
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<div>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Hi World!"
						name="body"
						onChange={onChange}
						value={values.body}
						error={error ? true : false}
					/>
					<Button type="submit" color="teal">
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</div>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default PostForm;
