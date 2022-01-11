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
  visited: boolean;
  distance: number;
  previous: string | null;
};

export type GraphNodeList = {
  [id: string]: GraphNode;
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

export const dijkstra = (
  tokenList: AppTokenMetadataListObject,
  weightList: WeightList,
  source: string
) => {
  const nodes = Object.keys(tokenList).reduce((_nodes, tokenId) => {
    return {
      ..._nodes,
      [tokenId]: {
        id: tokenId,
        visited: false,
        distance: Infinity,
        previous: null,
      },
    };
  }, {} as GraphNodeList);

  nodes[source].distance = 0;

  const smallest = (node: GraphNode, nodes: GraphNodeList) => {
    let smallest: GraphNode | undefined = undefined;
    for (const neighborId of Object.keys(weightList[node.id])) {
      const neighbor = nodes[neighborId];
      if (neighbor.visited) continue;
      if (!smallest || smallest.distance > neighbor.distance) {
        smallest = neighbor;
      }
    }
    return smallest;
  };

  const updateNeighbors = (node: GraphNode) => {
    for (const neighborId of Object.keys(weightList[node.id])) {
      if (neighborId === source) continue;
      const distance = node.distance + weightList[node.id][neighborId];
      if (distance < nodes[neighborId].distance) {
        nodes[neighborId].distance = distance;
        nodes[neighborId].previous = node.id;
      }
    }
  };

  let node: GraphNode | undefined = nodes[source];
  while (node) {
    if (!node.visited) {
      node.visited = true;
      updateNeighbors(node);
    }
    node = smallest(node, nodes);
  }

  return nodes;
};

export const minimalPaths = (
  pairList: PairList,
  tokenList: AppTokenMetadataListObject
): void => {
  const weightList = getWeightList(pairList, tokenList);
  const graphNodes = dijkstra(tokenList, weightList, Object.keys(tokenList)[0]);
  console.log('graphNodes', Object.keys(tokenList)[0], graphNodes);
};
