import React from "react";

const dummyProjects = [
  {
    id: 1,
    name: "Python",
    summary: "機械学習の基礎を学ぶ",
    status: "未着手",
    dueDate: "2024/05/15",
    progress: 0,
    isLink: true,
  },
  {
    id: 2,
    name: "ネットワーク",
    summary: "TCP/IPの理解を深める",
    status: "進行中",
    dueDate: "2024/04/30",
    progress: 60,
  },
  {
    id: 3,
    name: "Laravel",
    summary: "Webアプリケーション",
    status: "完了",
    dueDate: "2024/06/10",
    progress: 100,
  },
  {
    id: 4,
    name: "フロントエンド",
    summary: "Reactの学習を進める",
    status: "進行中",
    dueDate: "2024/05/20",
    progress: 30,
  },
];

export default function ProjectListPage() {
  return (
    <div className="page">
      <div className="card">
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
            {dummyProjects.map((project) => (
              <tr key={project.id}>
                <td className="projectCell">
                  <a className="projectLink" href="#">
                    {project.name}
                  </a>
                </td>

                <td className="summaryCell">{project.summary}</td>
                <td className="statusCell">{project.status}</td>
                <td className="dueCell">{project.dueDate}</td>
                <td className="progressCell">{project.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}