import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectCreatePage from "./pages/ProjectCreatePage";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/projects" element={<ProjectListPage />} />
           <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
           <Route path="/projects/create" element={<ProjectCreatePage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


