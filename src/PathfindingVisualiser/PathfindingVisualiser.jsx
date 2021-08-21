import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { dijkstra } from "../algorithms/dijkstra";
import { astar } from "../algorithms/astar";
import { getNodesInShortestPathOrder } from "../algorithms/utils";
import Node from "./Node";
import styles from "./PathfindingVisualiser.module.css";
import nodeStyles from "./Node/Node.module.css";

const NO_OF_ROWS = 21;
const NO_OF_COLS = 41;
const INITIAL_START_NODE_ROW = 10;
const INITIAL_START_NODE_COL = 5;
const INITIAL_FINISH_NODE_ROW = 10;
const INITIAL_FINISH_NODE_COL = 35;

export default function PathfindingVisualiser() {
  const [grid, setGrid] = useState(() => setInitialGrid());
  const [startNode, setStartNode] = useState(() => setInitialStartNode());
  const [finishNode, setFinishNode] = useState(() => setInitialFinishNode());

  const [nodesInShortestPathOrder, setNodesInShortestPathOrder] = useState([]);
  const [visitedNodesInOrder, setVisitedNodesInOrder] = useState([]);

  const nodeRefs = useRef([]);
  nodeRefs.current = grid.map((row, rowIndex) => {
    return row.map((_, colIndex) =>
      !!nodeRefs.current.length
        ? nodeRefs.current[rowIndex][colIndex]
        : createRef()
    );
  });

  const animateShortestPath = useCallback(() => {
    if (nodesInShortestPathOrder.length === 1) return;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const { row, col } = nodesInShortestPathOrder[i];
        const nodeRef = nodeRefs.current[row][col];
        nodeRef.current.classList.add(nodeStyles.nodeShortestPath);
      }, 50 * i);
    }
  }, [nodesInShortestPathOrder]);

  const animate = useCallback(() => {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const { row, col } = visitedNodesInOrder[i];
        const nodeRef = nodeRefs.current[row][col];
        nodeRef.current.classList.add(nodeStyles.nodeVisited);
      }, 10 * i);
    }
  }, [animateShortestPath, nodesInShortestPathOrder, visitedNodesInOrder]);

  useEffect(() => {
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }, [animate, visitedNodesInOrder, nodesInShortestPathOrder]);

  const [disabledGrid, setDisabledGrid] = useState(false);

  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [allowDiagonals, setAllowDiagonals] = useState(false);

  function visualiseDijkstra() {
    setDisabledGrid(true);
    setVisitedNodesInOrder(
      dijkstra(
        grid,
        grid[startNode.row][startNode.col],
        grid[finishNode.row][finishNode.col]
      )
    );
    setNodesInShortestPathOrder(
      getNodesInShortestPathOrder(grid[finishNode.row][finishNode.col])
    );
  }

  function visualiseAStar() {
    setDisabledGrid(true);
    console.log({ nodesInShortestPathOrder, visitedNodesInOrder });
    setVisitedNodesInOrder(
      astar(
        grid,
        grid[startNode.row][startNode.col],
        grid[finishNode.row][finishNode.col],
        allowDiagonals
      )
    );
    setNodesInShortestPathOrder(
      getNodesInShortestPathOrder(grid[finishNode.row][finishNode.col])
    );
  }

  function isStartNode(row, col) {
    if (!startNode) return false;
    return row === startNode.row && col === startNode.col;
  }

  function isFinishNode(row, col) {
    if (!finishNode) return false;
    return row === finishNode.row && col === finishNode.col;
  }

  function handleMouseDown(row, col) {
    if (disabledGrid) return;

    if (isStartNode(row, col)) {
      toggleStartNode(grid, row, col, false);
      setStartNode(null);
      return;
    }

    if (!startNode && !isFinishNode(row, col)) {
      toggleStartNode(grid, row, col, true);
      setStartNode(() => ({
        row,
        col,
      }));
      return;
    }

    if (isFinishNode(row, col)) {
      toggleFinishNode(grid, row, col, false);
      setFinishNode(null);
      return;
    }

    if (!finishNode && !isStartNode(row, col)) {
      toggleFinishNode(grid, row, col, true);
      console.log("setting finish node");
      setFinishNode(() => ({
        row,
        col,
      }));
      return;
    }

    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    if (disabledGrid) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
    if (disabledGrid) return;
    setMouseIsPressed(false);
  }

  function resetShortestPath() {
    nodesInShortestPathOrder.forEach((node) =>
      nodeRefs.current[node.row][node.col].current.classList.remove(
        nodeStyles.nodeShortestPath
      )
    );
    setNodesInShortestPathOrder([]);
  }

  function resetVisitedNodes() {
    visitedNodesInOrder.forEach((node) =>
      nodeRefs.current[node.row][node.col].current.classList.remove(
        nodeStyles.nodeVisited
      )
    );
    setVisitedNodesInOrder([]);
  }

  function resetPath() {
    resetShortestPath();
    resetVisitedNodes();
    setGrid(resetAlgorithm(grid, startNode, finishNode));
    setDisabledGrid(false);
  }

  function reset() {
    resetShortestPath();
    resetVisitedNodes();
    setGrid(setInitialGrid());
    setStartNode(setInitialStartNode());
    setFinishNode(setInitialFinishNode());
    setDisabledGrid(false);
  }

  return (
    <>
      <button onClick={() => visualiseAStar()}>Visualise A* Algorithm</button>
      <button onClick={() => visualiseDijkstra()}>
        Visualise Dijkstra's Algorithm
      </button>
      <button onClick={() => resetPath()}>Reset Grid</button>
      <input
        id="allowDiagonals"
        type="checkbox"
        value={allowDiagonals}
        onChange={(e) => setAllowDiagonals(e.target.checked)}
      />
      <label htmlFor="allowDiagonals">Allow Diagonals</label>
      <div className={styles.grid}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((node, nodeIndex) => {
              const { row, col, isStart, isFinish, isWall } = node;
              return (
                <Node
                  ref={nodeRefs.current[row][col]}
                  key={nodeIndex}
                  row={row}
                  col={col}
                  isStart={isStart}
                  isFinish={isFinish}
                  isWall={isWall}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={() => handleMouseUp()}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

function createNode(row, col, isStart = false, isFinish = false) {
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

function toggleFinishNode(grid, row, col, isFinish) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function toggleStartNode(grid, row, col, isStart) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

function createGrid(startNodeRow, startNodeCol, finishNodeRow, finishNodeCol) {
  const grid = [];

  for (let row = 0; row < NO_OF_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NO_OF_COLS; col++) {
      if (row === startNodeRow && col === startNodeCol) {
        currentRow.push(createNode(row, col, true, false));
        continue;
      }

      if (row === finishNodeRow && col === finishNodeCol) {
        currentRow.push(createNode(row, col, false, true));
        continue;
      }

      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }

  return grid;
}

function setInitialGrid() {
  return createGrid(
    INITIAL_START_NODE_ROW,
    INITIAL_START_NODE_COL,
    INITIAL_FINISH_NODE_ROW,
    INITIAL_FINISH_NODE_COL
  );
}

function setInitialStartNode() {
  return {
    row: INITIAL_START_NODE_ROW,
    col: INITIAL_START_NODE_COL,
  };
}

function setInitialFinishNode() {
  return {
    row: INITIAL_FINISH_NODE_ROW,
    col: INITIAL_FINISH_NODE_COL,
  };
}

function resetAlgorithm(grid, startNode, finishNode) {
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
