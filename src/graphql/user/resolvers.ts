import UserService, { createUserPayload } from '../../services/UserService';

const queries = {
  getUserToken: async (
    _: any,
    { email, password }: { email: string; password: string }
  ) => {
    let token = await UserService.getUserToken(email, password);
    return token;
  },
  getLoggedInUser: async (_: any, __: any, context: any) => {
    if (!context.user) {
      throw new Error('Not logged in');
    }
    let id = context.user.id;
    let user = await UserService.findUserById(id);
    return user;
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
