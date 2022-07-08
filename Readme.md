# World Connect

## Description

World Connects is a full stack social media application. This project has full authentication, authorization and CRUD features built in. Users can create posts while liking and commenting to update in real time.

Website Production - <https://worldconnection.netlify.app/>

<img src ="https://api.netlify.com/api/v1/badges/afe4370c-a7b6-4f00-8ddd-3aa23dff2bf5/deploy-status" alt ="Social Media" />

## Table of Contents
  - [Description](#description)
  - [Deploying Locally or Hosting](#deploying-locally-or-hosting)
  - [Authentication](#authentication)
  - [Authorization](#authorization)
  - [Login](#login)
  - [Register](#register)
  - [GraphQL Type Definitions](#graphql-type-definitions)
    - [Schema](#schema)
    - [Query](#query)
    - [Mutations](#mutations)
  - [Server](#server)
    - [Connection of MongoDB server to Apollo server](#connection-of-mongodb-server-to-apollo-server)
    - [Establishing Apollo Client](#Establishing-apollo-client)
  - [Available Scripts](#available-scripts)


## Deploying Locally or Hosting

If you want to run the website locally or hosting it rename `config.js.example` to `config.js`.

Then add your mongoDB connection api key. If no api key are stored the program will not run.

At root folder run `npm run dev` for local deployment or `npm run build` for remote deployment.

## Authentication

A check is run in order to see if the user's login token is valid. If the login token is invalid (token becomes invalid after an hour of being logged in). They are denied the ability to like, create or delete their own post until they login again.

If a user tries to impersonate another user by attempting to delete a post they never created they are denied because the only way to delete another user post is by checking if the ID of the post itself corresponds correctly to the allowed user credentials.

Like count increments is correlated to authentication because a user can only like or unlike a post as a boolean. Authentication comes before the like count itself, a middleware. Authentication decides which user like boolean truthy value to be changed to true or false. Using that data change as a reference to update the total like count. If a user has liked a post or unliked a post the boolean status is checked by referencing the user credentials.

## Authorization

Deletion of posts, uses authorization by denying everyone except the user who created the post by checking their access token.
Gives access to create a post or comment on any other user post. Users do not need special access tokens to comment on other people's posts.

## Login

Referenced mongoDB user credentials database to see if user does exist, if so login.

## Register

<!-- validators.js -->

Created edge cases for users id and email in order to receive formatted data.



## GraphQL Type Definitions

Schema for mongodb with apollo.

### Schema

[Typed Definitions](graphql/typeDefs.js)

    Post, Comment, Like, User, RegisterInput

### Query

    getPosts: [Post] 
    getPost(postId: ID!): Post

### Mutations

    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!

    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    likePost(postId: ID!): Post!

    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
## Server

### Connection of MongoDB server to Apollo server

[Server - index.js](index.js)

```typescript
    const { ApolloServer } = require("apollo-server");
    const gql = require("graphql-tag");
    const mongoose = require("mongoose"); // orm lib, lets us interface with mongoDB
    const PORT = process.env.PORT || 5000;

    const typeDefs = require("./graphql/typeDefs.js");
    const resolvers = require("./graphql/resolvers");
    const { MONGODB } = require("./config.js");

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        // Context req gets from express
        // fowards req into the context so that we can access it with in our context
        context: ({ req }) => ({ req }),
    });

    mongoose
        .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("MongoDB Connected");
            return server.listen({ port: PORT });
        })
        .then((res) => {
            console.log(`Server running at ${res.url}`);
        })
        .catch((err) => {
            console.error(err);
        });
```

### Establishing Apollo Client

[ApolloProvider.js](client/src/Apollo/ApolloProvider.js)

``` javascript
    const httpLink = createHttpLink({
        uri: "http://localhost:5000",
    });

    const authLink = setContext((req, pre) => {
        const token = localStorage.getItem("jwtToken"); // Set as auth header
        return {
            // Will modifiy current request
            headers: {
                Authorization: token ? `Bearer ${token}` : "", // Merge headers of request with current exisiting headers
            },
        };
    });

    const client = new ApolloClient({
        link: authLink.concat(httpLink), // Adds the token to our request and succesfully send any protected api call
        cache: new InMemoryCache(), // Instantiates memory in cache
    });

    export default (
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    );
```

## Available Scripts

In the root project directory, you can run:

`npm run dev`

Runs two npm commands concurrently. `\"npm run start\" \"npm run client\"`

`npm run start`

To run the backend server in nodemon at ``localhost:5000``.

 `npm run server`

To run backend server at ``localhost:5000``.

`npm run client`

Change directory to frontend/client.

To run frontend client at ``localhost:3000``
