import React from "react";
import styles from "./Legend.module.css";

export default function Legend() {
  return (
    <div className={styles.legend}>
      <div>
        <div className={styles.start}></div>
        <p>Start</p>
      </div>
      <div>
        <div className={styles.finish}></div>
        <p>Finish</p>
      </div>
      <div>
        <div className={styles.wall}></div>
        <p>Wall</p>
      </div>
      <div>
        <div className={styles.shortestPath}></div>
        <p>Shortest Path</p>
      </div>
      <div>
        <div className={styles.visited}></div>
        <p>Visited</p>
      </div>
    </div>
  );
}
