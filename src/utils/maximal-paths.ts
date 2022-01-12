import { AppTokenMetadataListObject, PairList } from '@/models';

import { getAmountOut } from './format';

export type WeightItems = {
  [id: string]: number;
};

export type WeightList = {
  [id: string]: WeightItems;
};

export type GraphNode = {
  id: string;
  coefficient: number;
  path: Set<string>;
};

export type GraphNodeList = {
  [id: string]: GraphNode;
};

export type MinimalPath = {
  coefficient: number;
  path: string[];
};

export type MinimalPathsResult = {
  [id: string]: MinimalPath;
};

const getWeightList = (
  pairList: PairList,
  tokenList: AppTokenMetadataListObject
): WeightList => {
  return Object.values(pairList).reduce((weightList, paired) => {
    let _t0id = '';
    const pairedWeights = Object.values(paired).reduce((weightItems, pair) => {
      const { token0: t0id, token1: t1id, reserve0, reserve1 } = pair;
      const token0 = tokenList[t0id];
      const token1 = tokenList[t1id];

      _t0id = t0id;

      const weight = getAmountOut({
        amountIn: 1,
        decimalsIn: token0.decimals,
        decimalsOut: token1.decimals,
        reserveIn: Number(reserve0),
        reserveOut: Number(reserve1),
      });

      return {
        ...weightItems,
        [t1id]: Number(weight),
      };
    }, {} as WeightItems);

    return {
      ...weightList,
      [_t0id]: pairedWeights,
    };
  }, {} as WeightList);
};

export const findMaximalPaths = (weightList: WeightList, source: string) => {
  const nodes = Object.keys(weightList).reduce((_nodes, tokenId) => {
    return {
      ..._nodes,
      [tokenId]: {
        id: tokenId,
        coefficient: 0,
        path: new Set<string>(),
      },
    };
  }, {} as GraphNodeList);

  const testNode = (
    node: GraphNode,
    path: Set<string> = new Set(),
    pathDistance = 1
  ) => {
    const previousId = [...path].pop();

    const newPathDistance = previousId
      ? pathDistance * weightList[previousId][node.id]
      : pathDistance;
    const newPath = new Set([...path, node.id]);

    if (newPathDistance > node.coefficient) {
      node.coefficient = newPathDistance;
      node.path = newPath;
    }

    for (const neighborId in weightList[node.id]) {
      const neighbor = nodes[neighborId];
      if (!path.has(neighborId)) {
        testNode(neighbor, newPath, newPathDistance);
      }
    }
  };

  testNode(nodes[source]);

  return nodes;
};

const parseMaximalPaths = (
  nodes: GraphNodeList,
  source: string
): MinimalPathsResult => {
  const result: MinimalPathsResult = {};
  for (const node of Object.values(nodes)) {
    if (node.id === source || node.id === null) continue;
    result[node.id] = {
      path: Array.from(node.path),
      coefficient: node.coefficient,
    };
  }
  return result;
};

export const getTokenPaths = (
  pairList: PairList,
  tokenList: AppTokenMetadataListObject,
  tokenId: string
): MinimalPathsResult => {
  const weightList = getWeightList(pairList, tokenList);
  if (!weightList[tokenId]) return {};
  const graphNodes = findMaximalPaths(weightList, tokenId);
  const maximalPaths = parseMaximalPaths(graphNodes, tokenId);

  console.log('graphNodes', tokenId, maximalPaths);
  return maximalPaths;
};
