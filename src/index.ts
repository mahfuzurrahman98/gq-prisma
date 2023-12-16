import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';

dotenv.config();
const app: Express = express();
const PORT: number = Number(process.env.PORT) || 4000;

const typeDefs = `
    type Query {
      hello: String
    }
  `;
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
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
