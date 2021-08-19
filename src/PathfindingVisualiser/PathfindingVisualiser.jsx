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

export default function PathfindingVisualiser() {
  const [grid, setGrid] = useState(() => createGrid());
  const [startNode, setStartNode] = useState(() => {
    const node = grid[0][0];
    node.isStart = true;
    return node;
  });
  const [finishNode, setFinishNode] = useState(() => {
    const node = grid[8][9];
    node.isFinish = true;
    return node;
  });
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
  }, [nodesInShortestPathOrder, visitedNodesInOrder]);

  useEffect(() => {
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }, [animate, visitedNodesInOrder, nodesInShortestPathOrder]);

  const [disabledGrid, setDisabledGrid] = useState(false);

  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [allowDiagonals, setAllowDiagonals] = useState(false);

  function visualiseDijkstra() {
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function visualiseAStar() {
    setDisabledGrid(true);
    setVisitedNodesInOrder(astar(grid, startNode, finishNode, allowDiagonals));
    setNodesInShortestPathOrder(
      getNodesInShortestPathOrder(grid[finishNode.row][finishNode.col])
    );
  }

  function mouseDisabled(row, col) {
    return (
      disabledGrid ||
      (row === startNode.row && col === startNode.col) ||
      (row === finishNode.row && col === finishNode.col)
    );
  }

  function handleMouseDown(row, col) {
    if (mouseDisabled(row, col)) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    if (mouseDisabled(row, col)) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
    if (disabledGrid) return;
    setMouseIsPressed(false);
  }

  function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
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
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    if (nodesInShortestPathOrder.length === 1) return;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const { row, col } = nodesInShortestPathOrder[i];
        const nodeRef = nodeRefs.current[row][col];
        nodeRef.current.classList.add(nodeStyles.nodeShortestPath);
      }, 50 * i);
    }
  }

  function resetGrid() {
    setGrid(createGrid());
  }

  return (
    <>
      <button onClick={() => visualiseAStar()}>Visualise A* Algorithm</button>
      <button onClick={() => visualiseDijkstra()}>
        Visualise Dijkstra's Algorithm
      </button>
      <button onClick={() => resetGrid()}>Reset Grid</button>
      <input
        id="allowDiagonals"
        type="checkbox"
        value={allowDiagonals}
        onChange={(e) => setAllowDiagonals(e.target.checked)}
      />
      <label htmlFor="allowDiagonals">Allow Diagonals</label>
      <div className={styles.grid}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex}>
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

function createNode(row, col) {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    fScore: Infinity,
    gScore: Infinity,
  };
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

function createGrid() {
  const grid = [];

  for (let row = 0; row < 10; row++) {
    const currentRow = [];
    for (let col = 0; col < 10; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }

  return grid;
}
