import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProjectDetailPage.css";

export default function ProjectDetailPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
    

        const res = await fetch(`http://localhost/api/projects/${projectId}`);

        if (!res.ok) {
          throw new Error("プロジェクトの取得に失敗しました");
        }

        const data = await res.json();

        setProject(data);
        setTasks(data.tasks ?? []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const getTaskStatusLabel = (task) => {
    if (task.is_done) return "完了";
    return "未完了";
  };

  const getTaskStatusClass = (task) => {
    if (task.is_done) return "statusBadge statusCompleted";
    return "statusBadge statusNotStarted";
  };

  if (loading) {
  return (
    <div className="page">
      <p>読み込み中...</p>
    </div>
  );
}


  if (error || !project) {
    return (
      <div className="page">
        <div className="card detailCard">
          <div className="projectInfoHeader">
            <div className="projectInfoContent">
              <p>{error ?? "プロジェクトが見つかりませんでした。"}</p>
              <Link to="/projects" className="backLink">
                プロジェクト一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = project.progress_percent ?? 0;

  return (
    <div className="page">
      {/* ヘッダー */}
      <div className="detailHeader">
        <h1 className="detailTitle">プロジェクト詳細</h1>
        <Link to="/projects" className="backLink">
          プロジェクト一覧に戻る
        </Link>
      </div>

      {/* プロジェクト概要カード */}
      <div className="card detailCard">
        <div className="projectInfoHeader">
          <div className="projectInfoContent">
            <h2 className="projectName">{project.name}</h2>
            <p className="projectSummary">{project.summary}</p>
            <div className="projectMeta">
              <span className="metaLabel">締切日</span>
              <span className="metaValue">{project.due_date}</span>
            </div>
            <div className="progressContainer">
              <div className="progressBar">
                <div
                  className="progressBarFill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="projectActions">
            <button className="actionButton" type="button">
              <span className="actionIcon">✏️</span>
              編集
            </button>
            <button className="actionButton" type="button">
              <span className="actionIcon">🗑️</span>
              削除
            </button>
          </div>
        </div>
      </div>

      {/* タスクリストカード */}
      <div className="card taskCard">
        <div className="taskTableContainer">
          <table className="table taskTable">
            <thead>
              <tr>
                <th className="colTaskName">タスク名</th>
                <th className="colTaskStatus">状況</th>
                <th className="colTaskDue">締切日</th>
                <th className="colTaskAction">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="taskNameCell">{task.name}</td>
                  <td className="taskStatusCell">
                    <span className={getTaskStatusClass(task)}>
                      {getTaskStatusLabel(task)}
                    </span>
                  </td>
                  <td className="taskDueCell">{task.due_date}</td>
                  <td className="taskActionCell">
                    <button className="editTaskButton" type="button">
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


