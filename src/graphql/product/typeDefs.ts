import {
  forwardConnectionArgs,
  connectionDefinitions,
} from 'graphql-relay-tools';

const typeDefs = `
type Product implements Node {
  id: ID!
  name: String!
  sku: String!
  description: String
  stock: Int!
  price: String!
  discountPrice: String
  images: [ProductImages!]!
}

type ProductImages {
  url: String!
}

type Query {
  products${forwardConnectionArgs()}: ProductConnection
}
`;

const { connectionType: ProductConnection } = connectionDefinitions({ name: 'Product' });

export default [typeDefs, ProductConnection];