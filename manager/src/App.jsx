import { BrowserRouter, Routes, Route } from "react-router-dom";
import List from "./components/List.jsx";
import Create from "./components/Create.jsx";
import './App.css';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}