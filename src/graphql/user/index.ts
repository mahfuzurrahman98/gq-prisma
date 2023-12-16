import { mutations } from './mutations';
import { queries } from './queries';
import { resolvers } from './resolvers';
import { typeDefs } from './typedefs';

const User = {
  typeDefs,
  resolvers,
  queries,
  mutations,
};

export default User;
