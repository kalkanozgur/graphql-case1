import { ILocation } from "./Interfaces/ILocation";
import { IParticipant } from "./Interfaces/IParticipant";
import { IEvent } from "./Interfaces/IEvent";
import { IUser } from "./Interfaces/IUser";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import data from "./data.json" assert { type: "json" };

const { events, locations, users, participants } = data;

const typeDefs = `#graphql

  type Event {
	id: Int
	title: String
	desc: String
	date: String
	from: String
	to: String
	participants: [Participant]
	location_id: Int
	location: Location
	user_id: Int
	user: User 
  }
  type Location {
	id: Int
	name: String
	desc: String
	lat: Float
	lng: Float
	events: [Event]
  }
  type User {
	id: Int
	username: String
	email: String
	events: [Event]
  }
  type Participant {
	id: Int
	user_id: Int
	user: User
	username: String
	event_id: Int
	event: Event
  }

  type Query {
	users: [User]
	user(id:Int!): User

	events: [Event]
	event(id:Int!): Event

	locations: [Location]
	location(id:Int!): Location

	participants: [Participant]
	participant(id:Int!): Participant
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
		users: () => users,
		user: (args: { id: number }) => users.find((user) => user.id === args.id),

		events: () => events,
		event: (args: { id: number }) =>
			events.find((event) => event.id === args.id),

		locations: () => locations,
		location: (args: { id: number }) =>
			locations.find((location) => location.id === args.id),

		participants: () => participants,
		participant: (args: { id: number }) =>
			participants.find((participant) => participant.id === args.id),
	},
	User: {
		events: (parent: IUser) =>
			events.filter((event) => event.user_id === parent.id),
	},
	Event: {
		location: (parent: IEvent) =>
			locations.find((location) => location.id === parent.location_id),
		user: (parent: IEvent) => users.find((user) => user.id === parent.id),
		participants: (parent: IEvent) =>
			participants.filter((participant) => participant.event_id === parent.id),
	},
	Participant: {
		event: (parent: IParticipant) =>
			events.find((event) => event.id === parent.id),
		username: (parent: IParticipant) =>
			users.find((user) => user.id === parent.user_id).username,
	},
	Location: {
		events: (parent: ILocation) =>
			events.filter((event) => event.location_id === parent.id),
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
