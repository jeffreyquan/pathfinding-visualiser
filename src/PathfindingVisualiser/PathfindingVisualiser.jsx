import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Container, FormGroup, Input, Label, Row } from "reactstrap";
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
import Scoreboard from "./Scoreboard";

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

  const [algorithm, setAlgorithm] = useState("astar");

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

  const [disabledDiagonals, setDisabledDiagonals] = useState(false);

  useEffect(() => {
    if (algorithm === "dijkstra") {
      setAllowDiagonals(false);
      setDisabledDiagonals(true);
    }

    if (algorithm === "astar") setDisabledDiagonals(false);
  }, [algorithm]);

  function visualiseAlgorithm() {
    if (algorithm === "astar") {
      setVisitedNodesInOrder(
        astar(
          grid,
          grid[startNode.row][startNode.col],
          grid[finishNode.row][finishNode.col],
          allowDiagonals
        )
      );
    } else if (algorithm === "dijkstra") {
      setVisitedNodesInOrder(
        dijkstra(
          grid,
          grid[startNode.row][startNode.col],
          grid[finishNode.row][finishNode.col],
          allowDiagonals
        )
      );
    }
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

  function setMaze() {
    resetShortestPath();
    resetVisitedNodes();
    setGrid(generateMaze(startNode, finishNode, NO_OF_ROWS, NO_OF_COLS));
  }

  function disableButton() {
    return startNode === null || finishNode === null;
  }

  return (
    <Container className={styles.container}>
      <Row>
        <FormGroup>
          <Label for="algorithmSelect">
            <h2>Select Algorithm</h2>
          </Label>
          <Input
            type="select"
            name="select"
            id="algorithmSelect"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="astar">A*</option>
            <option value="dijkstra">Dijkstra</option>
          </Input>
        </FormGroup>
      </Row>
      <Row>
        <FormGroup>
          <Label check>
            <Input
              disabled={disabledDiagonals}
              type="checkbox"
              aria-label="Checkbox for allowing diagonals in paths"
              value={allowDiagonals}
              onChange={(e) => setAllowDiagonals(e.target.checked)}
            />{" "}
            Allow Diagonals
          </Label>
        </FormGroup>
      </Row>
      <Row>
        <h2>Controls</h2>
        <div className={styles.buttonGroup}>
          <Button
            disabled={disabledGrid || disableButton()}
            color="primary"
            onClick={() => {
              resetPath();
              setDisabledGrid(true);
              visualiseAlgorithm();
            }}
          >
            Visualise
          </Button>
          <Button
            disabled={disabledGrid || disableButton()}
            outline
            color="secondary"
            onClick={() => setMaze()}
          >
            Generate Maze
          </Button>
          <Button
            disabled={disableButton()}
            outline
            color="danger"
            onClick={() => reset()}
          >
            Clear Board
          </Button>
          <Button
            disabled={disableButton()}
            outline
            color="warning"
            onClick={() => resetPath()}
          >
            Clear Path
          </Button>
        </div>
      </Row>
      <Row>
        <Scoreboard
          numberVisited={
            visitedNodesInOrder.length > 0 ? visitedNodesInOrder.length : "N/A"
          }
          numberShortestPath={
            nodesInShortestPathOrder.length > 0
              ? nodesInShortestPathOrder.length
              : "N/A"
          }
        />
      </Row>
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
    </Container>
  );
}
