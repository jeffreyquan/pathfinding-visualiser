// https://en.wikipedia.org/wiki/A*_search_algorithm

export function astar(grid, startNode, finishNode, allowDiagonals = false) {
  const visitedNodesInOrder = [];
  startNode.gScore = 0;
  startNode.fScore = heuristic(startNode, finishNode);
  let openSet = [];
  openSet.push(startNode);
  while (!!openSet.length) {
    const currentNode = getNodeWithLowestScore(openSet);
    if (currentNode.isWall) continue;
    if (currentNode.gScore === Infinity) return visitedNodesInOrder;
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    removeNodeFromList(openSet, currentNode);

    const neighbors = getNeighbors(currentNode, grid, allowDiagonals);

    for (const neighbor of neighbors) {
      const tentative_gScore =
        currentNode.gScore + heuristic(currentNode, neighbor, allowDiagonals);
      if (tentative_gScore < neighbor.gScore) {
        neighbor.previousNode = currentNode;
        neighbor.gScore = tentative_gScore;
        neighbor.fScore =
          neighbor.gScore + heuristic(neighbor, finishNode, allowDiagonals);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      } else {
        continue;
      }
    }
  }
  return visitedNodesInOrder;
}

function removeNodeFromList(nodes, node) {
  const index = nodes.indexOf(node);
  nodes.splice(index, 1);
}

function getNodeWithLowestScore(nodes) {
  return nodes.reduce((prev, curr) =>
    prev.fScore < curr.fScore ? prev : curr
  );
}

function heuristic(currentNode, finishNode, allowDiagonals) {
  return allowDiagonals
    ? Math.sqrt(
        (finishNode.col - currentNode.col) ** 2 +
          (finishNode.row - currentNode.row) ** 2
      )
    : Math.abs(finishNode.col - currentNode.col) +
        Math.abs(finishNode.row - currentNode.row);
}

function getNeighbors(node, grid, allowDiagonals) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  if (allowDiagonals) {
    // Diagonals
    // Top-left
    if (row > 0 && col > 0) neighbors.push(grid[row - 1][col - 1]);
    // Bottom-left
    if (row < grid.length - 1 && col > 0)
      neighbors.push(grid[row + 1][col - 1]);
    // Top-right
    if (row > 0 && col < grid[0].length - 1)
      neighbors.push(grid[row - 1][col + 1]);
    // Bottom-right
    if (row < grid.length - 1 && col < grid[0].length - 1)
      neighbors.push(grid[row + 1][col + 1]);
  }

  return neighbors.filter((neighbor) => !neighbor.isWall);
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
