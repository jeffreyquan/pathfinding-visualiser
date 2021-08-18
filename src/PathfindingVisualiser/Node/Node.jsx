import React from "react";
import clsx from "clsx";
import styles from "./Node.module.css";

export default function Node({
  row,
  col,
  isStart,
  isFinish,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  return (
    <div
      id={`node-${row}-${col}`}
      className={clsx(styles.node, {
        [styles.nodeStart]: isStart,
        [styles.nodeFinish]: isFinish,
        [styles.nodeWall]: isWall,
      })}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
}
