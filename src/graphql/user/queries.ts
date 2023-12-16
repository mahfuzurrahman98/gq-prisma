const queries = `#graphql
  getUserToken(email: String!, password: String!): String
  getLoggedInUser: User
`;

export { queries };
