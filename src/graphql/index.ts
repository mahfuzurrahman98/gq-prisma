import { ApolloServer } from '@apollo/server';
import { prisma } from '../lib/db';

const typeDefs = `
    type Query {
      hello: String
    },
    type Mutation {
      createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
    }
  `;
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
  Mutation: {
    createUser: async (
      _: any,
      {
        firstName,
        lastName,
        email,
        password,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }
    ) => {
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          profileImage: '', // Add the profileImage as an empty string
        },
      });
      return true;
    },
  },
};

export default async function createGraphQLServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  return server;
}
