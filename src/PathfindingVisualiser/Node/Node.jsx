import React, { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Node.module.css";

const Node = forwardRef(
  (
    {
      row,
      col,
      isStart,
      isFinish,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
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
);

export default Node;
