import "./App.css";
import PathfindingVisualiser from "./PathfindingVisualiser";

function App() {
  return (
    <div className="root">
      <div className="title">
        <h1>Pathfinding Visualiser</h1>
      </div>
      <div className="link">
        <a
          href="https://github.com/jeffreyquan/pathfinding-visualiser"
          target="_blank"
          rel="noreferrer noopener"
        >
          Github
        </a>
      </div>
      <PathfindingVisualiser />
    </div>
  );
}

export default App;
