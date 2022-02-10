import { AppTokenMetadataListObject, PairList } from '@/models';
import { SwapTokenDataKey } from '@/store';

import { getAmount } from './format';

export type WeightList = {
  [tokenId: string]: number;
};

export type GraphNode = {
  id: string;
  amountOut: number;
  path: Set<string>;
};

export type GraphNodeList = {
  [tokenId: string]: GraphNode;
};

export type MaximalPath = {
  amountOut: number;
  path: string[];
};

export type MaximalPathsList = {
  [tokenId: string]: MaximalPath;
};

export const findMaximalPaths = (
  pairList: PairList,
  tokenList: AppTokenMetadataListObject,
  source: string,
  initialAmount: number,
  dataKey: SwapTokenDataKey
) => {
  const nodes = Object.keys(pairList).reduce((_nodes, tokenId) => {
    return {
      ..._nodes,
      [tokenId]: {
        id: tokenId,
        amountOut: -1,
        path: new Set<string>(),
      },
    };
  }, {} as GraphNodeList);

  const getNeighborsWeights = (
    node: GraphNode,
    pathDistance: number
  ): WeightList => {
    const neighborsIds = Object.keys(pairList[node.id]);
    return neighborsIds.reduce<WeightList>((weightItems, neighborId) => {
      const weight = getAmount({
        amountIn: pathDistance,
        decimalsIn: tokenList[node.id].decimals,
        decimalsOut: tokenList[neighborId].decimals,
        reserveIn: Number(pairList[node.id][neighborId].reserve0),
        reserveOut: Number(pairList[node.id][neighborId].reserve1),
        dataKey,
      });
      return {
        ...weightItems,
        [neighborId]: Number(weight),
      };
    }, {});
  };

  const testNode = (
    node: GraphNode,
    path: Set<string> = new Set(),
    pathDistance = initialAmount,
    pathWeightList: WeightList = {}
  ) => {
    const previousId = [...path].pop();

    const newPathDistance = previousId ? pathWeightList[node.id] : pathDistance;
    const newPath = new Set([...path, node.id]);

    if (newPathDistance > node.amountOut) {
      node.amountOut = newPathDistance;
      node.path = newPath;
    }

    for (const neighborId in pairList[node.id]) {
      const neighbor = nodes[neighborId];
      if (!path.has(neighborId)) {
        testNode(
          neighbor,
          newPath,
          newPathDistance,
          getNeighborsWeights(node, newPathDistance)
        );
      }
    }
  };

  testNode(nodes[source]);

  return nodes;
};

const parseMaximalPaths = (nodes: GraphNodeList): MaximalPathsList => {
  const result: MaximalPathsList = {};
  for (const node of Object.values(nodes)) {
    if (node.path.size < 2) continue;
    result[node.id] = {
      path: Array.from(node.path),
      amountOut: node.amountOut,
    };
  }
  return result;
};

export type GetTokenPathsOptions = {
  pairList: PairList;
  tokenList: AppTokenMetadataListObject;
  tokenId: string;
  amount?: string;
  dataKey?: SwapTokenDataKey;
};

export const getTokenPaths = ({
  pairList,
  tokenList,
  tokenId,
  amount = '1',
  dataKey = 'from',
}: GetTokenPathsOptions): MaximalPathsList => {
  if (!pairList[tokenId]) return {};
  const graphNodes = findMaximalPaths(
    pairList,
    tokenList,
    tokenId,
    Number(amount),
    dataKey
  );
  return parseMaximalPaths(graphNodes);
};
