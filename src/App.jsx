import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/projects" element={<ProjectListPage />} />
           <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
