export function generateMaze(
  grid,
  rowStart,
  rowEnd,
  colStart,
  colEnd,
  gridHasPerimeterWalls,
  orientation = "vertical"
) {
  let mazeWalls = [];
  maze(
    grid,
    rowStart,
    rowEnd,
    colStart,
    colEnd,
    gridHasPerimeterWalls,
    orientation,
    mazeWalls
  );

  console.log(mazeWalls);

  return mazeWalls;
}

function maze(
  grid,
  rowStart,
  rowEnd,
  colStart,
  colEnd,
  gridHasPerimeterWalls,
  orientation,
  mazeWalls
) {}
