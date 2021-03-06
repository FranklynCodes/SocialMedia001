import React, { useContext } from "react";
import { Button, Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton.js";
import DeleteButton from "./DeleteButton.js";
import MyPopup from "../util/MyPopup";

// Destructing props. from props from post // To avoid Get properties
//TODO: Add compressed versions of images locally
function PostCard({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) {
	const { user } = useContext(AuthContext);

	// TODO: Refactor to use userefs, refs ReactStrict Error
	return (
		<div>
			<Card fluid>
				<Card.Content>
					<Image
						floated="right"
						size="mini"
						src="https://react.semantic-ui.com/images/avatar/large/molly.png"
					/>
					<Card.Header>{username}</Card.Header>
					<Card.Meta as={Link} to={`/posts/${id}`}>
						{moment(createdAt).fromNow(true)}
					</Card.Meta>
					<Card.Description>{body}</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<LikeButton user={user} post={{ id, likes, likeCount }} />
					<MyPopup content="Comment on post">
						<Button labelPosition="right" as={Link} to={`/posts/${id}`}>
							<Button color="blue" basic>
								<Icon name="comments" />
							</Button>
							<Label basic color="blue" pointing="left">
								{commentCount}
							</Label>
						</Button>
					</MyPopup>
					{/* If user, logged in username is equal to posts username allow access  */}
					{user && user.username === username && (
						<DeleteButton postId={id}></DeleteButton>
					)}
				</Card.Content>
			</Card>
		</div>
	);
}

export default PostCard;
