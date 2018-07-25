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
  mainImage: ProductImage
  images: [ProductImage!]!
}

type ProductImage {
  url: String!
}

type Query {
  products${forwardConnectionArgs()}: ProductConnection
}
`;

const { connectionType: ProductConnection } = connectionDefinitions({
  name: 'Product',
  connectionFields: 'total: Int!',
});

export default [typeDefs, ProductConnection];