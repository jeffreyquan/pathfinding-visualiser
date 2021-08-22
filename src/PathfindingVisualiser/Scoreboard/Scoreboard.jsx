import React from "react";
import styles from "./Scoreboard.module.css";

export default function Scoreboard({ numberVisited, numberShortestPath }) {
  return (
    <div className={styles.scoreboard}>
      <div>Cells visited: {numberVisited}</div>
      <div>Cells on shortest path: {numberShortestPath}</div>
    </div>
  );
}
