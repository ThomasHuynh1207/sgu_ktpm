import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Chào mừng đến với Website Bán Máy Tính 💻</h1>
        <p>Đây là giao diện frontend React kết nối với backend Node.js.</p>
      </div>
    </div>
  );
}

export default App;
