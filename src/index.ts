import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { prisma } from './lib/db';

dotenv.config();
const app: Express = express();
const PORT: number = Number(process.env.PORT) || 4000;

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

(async function () {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/graphql', expressMiddleware(server));

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Express ready at http://localhost:${PORT}`);
    console.log(`🚀 Graphql ready at http://localhost:${PORT}/graphql`);
  });
})();
