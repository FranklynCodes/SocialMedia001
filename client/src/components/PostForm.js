import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/react-hooks";

function PostForm() {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: "",
	}); // createpost = callback

	// For register and login section we used on error method then set them to local errors but here it doesn't make sense
	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(_, result) {
			console.log("PostForm\tresult:", result);
			values.body = "";
		},
	});

    function createPostCallback(){
        createPost()
    }

	return (
		<Form onSubmit={onSubmit}>
			<h2>Create a post:</h2>
			<Form.Field>
				<Form.Input
					placeholder="Twitter Clone"
					name="body"
					onChange={onChange}
					value={values.body}
				></Form.Input>
				<Button type="sumbit" color="teal">
					Sumbit
				</Button>
			</Form.Field>
		</Form>
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
export default PostForm();
