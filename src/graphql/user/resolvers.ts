import UserService, { createUserPayload } from '../../services/UserService';

const queries = {
  getUserToken: async (
    _: any,
    { email, password }: { email: string; password: string }
  ) => {
    let token = await UserService.getUserToken(email, password);
    return token;
  },
};

const mutations = {
  createUser: async (_: any, payload: createUserPayload) => {
    let newUser = await UserService.createUser(payload);
    return newUser.id;
  },
};

const resolvers = { queries, mutations };
export { resolvers };
