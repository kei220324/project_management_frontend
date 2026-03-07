import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ProjectListPage.css";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [flashMessage, setFlashMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
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

          <button className="primaryButton" type="button">
            <span className="plus">＋</span>
            新規プロジェクト
          </button>
        </header>

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
                  <Link className="projectLink" to={`/projects/${project.id}`}>
                    {project.name}
                  </Link>
                </td>

                <td className="summaryCell">{project.summary}</td>
                <td className="statusCell">{project.status}</td>
                <td className="dueCell">{project.due_date}</td>
                <td className="progressCell">{project.progress_percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
