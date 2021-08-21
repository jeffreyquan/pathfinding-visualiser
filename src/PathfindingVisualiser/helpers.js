export function createGrid(startNode, finishNode, noOfRows, noOfCols) {
  const grid = [];

  for (let row = 0; row < noOfRows; row++) {
    const currentRow = [];
    for (let col = 0; col < noOfCols; col++) {
      if (row === startNode.row && col === startNode.col) {
        currentRow.push(createNode(row, col, true, false));
        continue;
      }

      if (row === finishNode.row && col === finishNode.col) {
        currentRow.push(createNode(row, col, false, true));
        continue;
      }

      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }

  return grid;
}

export function createNode(row, col, isStart = false, isFinish = false) {
  return {
    col,
    row,
    isStart,
    isFinish,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    fScore: Infinity,
    gScore: Infinity,
  };
}

export function toggleFinishNode(grid, row, col, isFinish) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

export function toggleStartNode(grid, row, col, isStart) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

export function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

export function setInitialNode(node) {
  const { row, col } = node;
  return {
    row,
    col,
  };
}

export function resetAlgorithm(grid, startNode, finishNode) {
  return grid.map((row, rowIndex) =>
    row.map((node, colIndex) => {
      if (node.isWall) {
        const newNode = createNode(rowIndex, colIndex);
        newNode.isWall = true;
        return newNode;
      }
      const isStart = rowIndex === startNode.row && colIndex === startNode.col;
      const isFinish =
        rowIndex === finishNode.row && colIndex === finishNode.col;
      return createNode(rowIndex, colIndex, isStart, isFinish);
    })
  );
}
