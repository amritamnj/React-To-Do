import React from "react";
import Navbar from "./components/Navbar";
import Board from "./components/Board";

function App() {
  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
      <Board />
    </div>
  );
}

export default App;
