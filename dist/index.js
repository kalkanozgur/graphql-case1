import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import data from "./data.json" assert { type: "json" };
const { events, locations, users, participants } = data;
const typeDefs = `#graphql

  type Event {
	id: ID
	title: String
	desc: String
	date: String
	from: String
	to: String
	location_id: Int
	user_id: Int
  }
  type Location {
	id: Int
	name: String
	desc: String
	lat: Float
	lng: Float
  }
  type User {
	id: Int
	username: String
	email: String
  }
  type Participant {
	id: Int
	user_id: Int
	event_id: Int
  }

  type Query {
	events: [Event]
	locations: [Location]
	users: [User]
	participants: [Participant]
  }
`;
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        events: () => events,
        locations: () => locations,
        users: () => users,
        participants: () => participants,
    },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
