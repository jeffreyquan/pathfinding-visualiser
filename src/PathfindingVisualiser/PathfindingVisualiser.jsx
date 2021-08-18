import React, { useState } from "react";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { astar } from "../algorithms/astar";
import Node from "./Node";
import styles from "./PathfindingVisualiser.module.css";
import nodeStyles from "./Node/Node.module.css";

const START_NODE_ROW = 0;
const START_NODE_COL = 0;
const FINISH_NODE_ROW = 8;
const FINISH_NODE_COL = 9;

export default function PathfindingVisualiser() {
  const [grid, setGrid] = useState(() => createInitialGrid());
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [allowDiagonals, setAllowDiagonals] = useState(false);

  function visualiseDijkstra() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function visualiseAStar() {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(
      grid,
      startNode,
      finishNode,
      allowDiagonals
    );
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log({ visitedNodesInOrder, nodesInShortestPathOrder });
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  }

  function handleMouseUp() {
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
        const node = visitedNodesInOrder[i];
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `${nodeStyles.node} ${nodeStyles.nodeVisited}`;
      }, 10 * i);
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    if (nodesInShortestPathOrder.length === 1) return;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `${nodeStyles.node} ${nodeStyles.nodeShortestPath}`;
      }, 50 * i);
    }
  }

  return (
    <>
      <button onClick={() => visualiseAStar()}>Visualise A* Algorithm</button>
      <button onClick={() => visualiseDijkstra()}>
        Visualise Dijkstra's Algorithm
      </button>
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

function createInitialGrid() {
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

function createNode(row, col) {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
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
