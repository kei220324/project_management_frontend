import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ProjectListPage from "./pages/ProjectListPage";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/projects" element={<ProjectListPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
