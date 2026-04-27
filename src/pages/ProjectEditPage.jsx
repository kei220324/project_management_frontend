import "./ProjectEditPage.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectEditPage() {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { projectId } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const projectApiUrl = `${API_BASE_URL}/projects/${projectId}`;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const res = await fetch(projectApiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          summary,
          due_date: dueDate,
        }),
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }

      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error updating project:", error);
      setSubmitError("プロジェクトの更新に失敗しました");
    }
  };
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(projectApiUrl);

        if (!res.ok) {
          throw new Error("プロジェクトの取得に失敗しました");
        }

        const data = await res.json();

        setName(data.name);
        setSummary(data.summary);
        setDueDate(data.due_date);
      } catch (e) {
        console.error(e);
        setFetchError("プロジェクトの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectApiUrl]);
  return (
    <div className="projectEditPage">
      <div className="projectEditContainer">
        <h1 className="projectEditTitle">プロジェクト編集</h1>

        <div className="projectEditCard">
          {loading ? (
            <p>読み込み中...</p>
          ) : fetchError ? (
            <p className="errorMessage">{fetchError}</p>
          ) : (
            <form className="projectEditForm" onSubmit={handleSubmit}>
              {submitError && <p className="errorMessage">{submitError}</p>}
              <div className="projectEditField">
                <label className="projectEditLabel" htmlFor="projectName">
                  プロジェクト名
                </label>
                <input
                  id="projectName"
                  className="projectEditInput"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="projectEditField">
                <label className="projectEditLabel" htmlFor="projectSummary">
                  概要
                </label>
                <textarea
                  id="projectSummary"
                  className="projectEditTextarea"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div className="projectEditField projectEditFieldSmall">
                <label className="projectEditLabel" htmlFor="projectDueDate">
                  締切日
                </label>
                <input
                  id="projectDueDate"
                  className="projectEditInput projectEditDateInput"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="projectEditActions">
                <button type="submit" className="projectEditSaveButton">
                  保存
                </button>
                <button
                  type="button"
                  className="projectEditCancelButton"
                  onClick={() => navigate(`/projects/${projectId}`)}
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
