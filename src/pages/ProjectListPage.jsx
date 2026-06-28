import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ProjectListPage.css";

const statusLabelMap = {
  todo: "未着手",
  doing: "進行中",
  done: "完了",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [flashMessage, setFlashMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const projectsApiUrl = `${API_BASE_URL}/projects`;

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(projectsApiUrl);

      if (!res.ok) {
        throw new Error("データ取得に失敗しました");
      }

      const data = await res.json();

      setProjects(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const message = location.state?.message;

    if (!message) return;

    setFlashMessage(message);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="page">
      <div className="card">
        {flashMessage && <p className="successMessage">{flashMessage}</p>}

        <header className="cardHeader">
          <h1 className="title">プロジェクト管理</h1>

          <Link to="/projects/create" className="primaryButton">
            <span className="buttonIcon">＋</span>
            <span>新規プロジェクト</span>
          </Link>
        </header>

        {loading && <p className="infoMessage">読み込み中...</p>}

        {error && (
          <div className="errorBox">
            <p className="errorMessage">{error}</p>
            <button
              type="button"
              className="retryButton"
              onClick={fetchProjects}
            >
              再読み込み
            </button>
          </div>
        )}

        {!loading && !error && (
          <table className="table">
            <thead>
              <tr>
                <th className="colProject">プロジェクト</th>
                <th className="colSummary">概要</th>
                <th className="colStatus">ステータス</th>
                <th className="colDue">締切</th>
                <th className="colProgress">進捗</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="projectCell">
                    <Link
                      className="projectLink"
                      to={`/projects/${project.id}`}
                    >
                      {project.name}
                    </Link>
                  </td>

                  <td className="summaryCell">{project.summary}</td>
                  <td className="statusCell">
                    {statusLabelMap[project.status] ?? project.status}
                  </td>
                  <td className="dueCell">{project.due_date}</td>
                  <td className="progressCell">{project.progress_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
