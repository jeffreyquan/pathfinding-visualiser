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
import {
  createGrid,
  getNewGridWithWallToggled,
  resetAlgorithm,
  setInitialNode,
  toggleFinishNode,
  toggleStartNode,
} from "./helpers";
import { generateMaze } from "../algorithms/generateMaze";

// Initial Grid Constants
const NO_OF_ROWS = 21;
const NO_OF_COLS = 21;
const START_NODE = {
  row: 10,
  col: 5,
};
const FINISH_NODE = {
  row: 10,
  col: 15,
};

export default function PathfindingVisualiser() {
  const [grid, setGrid] = useState(() =>
    createGrid(START_NODE, FINISH_NODE, NO_OF_ROWS, NO_OF_COLS)
  );

  const [startNode, setStartNode] = useState(() => setInitialNode(START_NODE));

  const [finishNode, setFinishNode] = useState(() =>
    setInitialNode(FINISH_NODE)
  );

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

  function visualiseAlgorithm(algorithm) {
    setDisabledGrid(true);
    setVisitedNodesInOrder(
      algorithm(
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

  // Mouse events on nodes
  function handleMouseDown(row, col) {
    if (disabledGrid) return;

    if (isStartNode(row, col)) {
      toggleStartNode(grid, row, col, false);
      setStartNode(null);
      return;
    }

    if (!startNode && !isFinishNode(row, col)) {
      if (grid[row][col].isWall) return;
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
      if (grid[row][col].isWall) return;
      toggleFinishNode(grid, row, col, true);
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
    resetToInitialGrid();
    setDisabledGrid(false);
  }

  function resetToInitialGrid() {
    setGrid(createGrid(START_NODE, FINISH_NODE, NO_OF_ROWS, NO_OF_COLS));
    setStartNode(setInitialNode(START_NODE));
    setFinishNode(setInitialNode(FINISH_NODE));
  }

  return (
    <>
      <button onClick={() => visualiseAlgorithm(astar)}>
        Visualise A* Algorithm
      </button>
      <button onClick={() => visualiseAlgorithm(dijkstra)}>
        Visualise Dijkstra's Algorithm
      </button>
      <button
        onClick={() => {
          const gridWithMaze = generateMaze(
            startNode,
            finishNode,
            NO_OF_ROWS,
            NO_OF_COLS
          );
          setGrid(gridWithMaze);
        }}
      >
        Generate Maze
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
