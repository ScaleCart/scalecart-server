import {
  nodeInterface,
  nodeField,
  nodesField,
  pageInfoType,
  nodeDefinitions,
  fromGlobalId,
} from 'graphql-relay-tools';
import { getNode } from './utils';

const typeSchema = `
type Query {
  ${nodeField}
  ${nodesField}
}
`;

const { nodeResolver, nodesResolver } = nodeDefinitions((globalId, ctx, resolveInfo) => {
  const { type, id } = fromGlobalId(globalId);
  if (resolveInfo.fieldNodes && resolveInfo.fieldNodes[0] && resolveInfo.fieldNodes[0].name.value === 'nodes') {
    resolveInfo.fieldNodes[0].name.value = 'node';
  }
  return getNode(id, type, ctx, resolveInfo);
});

export default {
  typeDefs: [typeSchema, nodeInterface, pageInfoType],
  resolvers: {
    Query: {
      node: nodeResolver,
      nodes: nodesResolver,
    },
    Node: {
      __resolveType: obj => obj.__type__,
    },
  }
};