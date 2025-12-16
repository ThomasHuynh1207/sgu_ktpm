// src/main.tsx – BẢN HOÀN HẢO TUYỆT ĐỐI, CHẠY NGON NGAY!
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // THÊM DÒNG NÀY

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>   {/* BỌC TOÀN BỌC TOÀN BỘ APP TRONG Router */}
    <App />
  </BrowserRouter>
);