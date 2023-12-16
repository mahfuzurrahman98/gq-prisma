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
    // keep only id, firstName, lastName, email and profileImage  in the response
    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      profileImage: newUser.profileImage,
    };
  },
};

const resolvers = { queries, mutations };
export { resolvers };
