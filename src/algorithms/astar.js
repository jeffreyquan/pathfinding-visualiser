// https://en.wikipedia.org/wiki/A*_search_algorithm

const SQUARE_ROOT_OF_TWO = Math.sqrt(2);

export function astar(grid, startNode, finishNode, allowDiagonals = false) {
  const visitedNodesInOrder = [];
  const openSet = [];
  startNode.gScore = 0;
  startNode.fScore = heuristic(startNode, finishNode);
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
  // http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#diagonal-distance
  const dx = Math.abs(finishNode.col - currentNode.col);
  const dy = Math.abs(finishNode.row - currentNode.row);
  return allowDiagonals
    ? dx + dy + (SQUARE_ROOT_OF_TWO - 2) * Math.min(dx, dy)
    : dx + dy;
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
