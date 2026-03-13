import "./ProjectEditPage.css";
import React, { useState } from "react";

export default function ProjectEditPage() {
  const [name, setName] = useState("Python");
  const [summary, setSummary] = useState("機械学習の基礎を学ぶ");
  const [dueDate, setDueDate] = useState("2024年5月31日");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="projectEditPage">
      <div className="projectEditContainer">
        <h1 className="projectEditTitle">プロジェクト編集</h1>

        <div className="projectEditCard">
          <form className="projectEditForm" onSubmit={handleSubmit}>
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
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="projectEditActions">
              <button type="submit" className="projectEditSaveButton">
                保存
              </button>
              <button type="button" className="projectEditCancelButton">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
