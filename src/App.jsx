import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectCreatePage from "./pages/ProjectCreatePage";
import ProjectEditPage from "./pages/ProjectEditPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={< HomePage />} />
         <Route path="/login" element={<LoginPage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/create" element={<ProjectCreatePage />} />
        <Route path="/projects/:projectId/edit" element={<ProjectEditPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;