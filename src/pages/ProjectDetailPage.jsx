import React from "react";
import { Link } from "react-router-dom";
import "./ProjectDetailPage.css";

export default function ProjectDetailPage() {
  // モックデータ（見た目のみの実装）
  const project = {
    id: 1,
    name: "Python",
    summary: "機械学習のノウハウを学ぶ",
    due_date: "2024年5月31日",
    progress_percent: 60,
  };

  const tasks = [
    { id: 1, name: "データ収集", status: "未着手", due_date: "2024年5月31日" },
    { id: 2, name: "前処理", status: "進行中", due_date: "2024年5月31日" },
    { id: 3, name: "モデル構築", status: "進行中", due_date: "2024年5月31日" },
    { id: 4, name: "評価", status: "完了", due_date: "2024年5月31日" },
    {
      id: 5,
      name: "ドキュメント作成",
      status: "完了",
      due_date: "2024年5月31日",
    },
  ];

  const getStatusClass = (status) => {
    console.log(status);
    if (status === "完了") return "statusBadge statusCompleted";
    if (status === "進行中") return "statusBadge statusInProgress";
    return "statusBadge statusNotStarted";
  };

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
                  style={{ width: `${project.progress_percent}%` }}
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
                  <td>{task.name}</td>
                  <td>{task.status}</td>
                  <td>{task.due_date}</td>
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
