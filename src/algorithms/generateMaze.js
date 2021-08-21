import { createGrid } from "../PathfindingVisualiser/helpers";

// https://stackoverflow.com/questions/23530756/maze-recursive-division-algorithm-design/23530960#23530960

export function generateMaze(startNode, finishNode, noOfRows, noOfCols) {
  const grid = createGrid(startNode, finishNode, noOfRows, noOfCols);
  addOuterWalls(grid, startNode, finishNode);
  addInnerWalls(grid, true, 1, noOfRows - 2, 1, noOfCols - 2);
  return grid;
}

function addOuterWalls(grid, startNode, finishNode) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (
        row === 0 ||
        row === grid.length - 1 ||
        col === 0 ||
        col === grid[0].length - 1
      ) {
        grid[row][col].isWall = true;
      }
    }
  }

  grid[startNode.row][startNode.col].isWall = false;
  grid[finishNode.row][finishNode.col].isWall = false;
}

function addInnerWalls(grid, isHorizontal, minX, maxX, minY, maxY) {
  if (isHorizontal) {
    if (maxX - minX < 2) {
      return;
    }

    const y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
    addHorizontalWall(grid, minX, maxX, y);

    addInnerWalls(grid, !isHorizontal, minX, maxX, minY, y - 1);
    addInnerWalls(grid, !isHorizontal, minX, maxX, y + 1, maxY);
  } else {
    if (maxY - minY < 2) {
      return;
    }

    const x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
    addVerticalWall(grid, minY, maxY, x);

    addInnerWalls(grid, !isHorizontal, minX, x - 1, minY, maxY);
    addInnerWalls(grid, !isHorizontal, x + 1, maxX, minY, maxY);
  }
}

function addHorizontalWall(grid, minX, maxX, y) {
  console.log({ y });
  const hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;

  for (let i = minX; i <= maxX; i++) {
    if (!grid[y][i].isStart && !grid[y][i].isFinish) {
      grid[y][i].isWall = true;
    }
  }

  if (y !== 0 && y !== grid.length - 1) grid[y][hole].isWall = false;
}

function addVerticalWall(grid, minY, maxY, x) {
  console.log({ x });
  const hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;

  for (let i = minY; i <= maxY; i++) {
    if (!grid[i][x].isStart && !grid[i][x].isFinish) {
      grid[i][x].isWall = true;
    }
  }

  if (x !== 0 && x !== grid[0].length - 1) grid[hole][x].isWall = false;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
