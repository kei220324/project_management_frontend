import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectListPage from "./pages/ProjectListPage";

function App() {
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
