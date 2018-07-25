import {
  forwardConnectionArgs,
  connectionDefinitions,
} from 'graphql-relay-tools';

const typeDefs = `
type Query {
  viewer: Customer
}

type Mutation {
  register (
    input: RegisterInput!
  ): RegisterPayload

  login (
    input: LoginInput!
  ): Customer

  logout: Boolean
}

type Customer {
  id: String!
  email: String!
  firstName: String!
  lastName: String!
  name: String!
}

input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
}

input LoginInput {
  email: String!
  password: String!
}

type RegisterPayload {
  success: Boolean!
  error: String
}
`;

export default [typeDefs];