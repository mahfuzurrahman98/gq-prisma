import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import createGraphQLServer from './graphql';
import UserService from './services/UserService';

dotenv.config();
const app: Express = express();
const PORT: number = Number(process.env.PORT) || 4000;

(async function () {
  const server = await createGraphQLServer();

  // apply middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // apply express middleware to Apollo Server
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // @ts-ignore
        try {
          const token: string = req.headers['token'] as string;
          const user = await UserService.decodeJWTToken(token);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  // test route
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Express ready at http://localhost:${PORT}`);
    console.log(`🚀 Graphql ready at http://localhost:${PORT}/graphql`);
  });
})();
