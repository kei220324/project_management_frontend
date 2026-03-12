import "./ProjectCreatePage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCreatePage() {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [dueDate, setDueDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost/api/projects", {
        method: "POST",
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
        throw new Error("プロジェクトの追加に失敗しました");
      }

      navigate("/projects", {
        state: { message: "プロジェクトを追加しました" },
      });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="projectCreatePage">
      <div className="projectCreateCard">
        <h1 className="projectCreateTitle">プロジェクト追加</h1>

        <div className="projectCreateFormGroup">
          <label className="projectCreateLabel">プロジェクト名</label>
          <input
            type="text"
            className="projectCreateInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="projectCreateFormGroup">
          <label className="projectCreateLabel">概要</label>
          <textarea
            className="projectCreateTextarea"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className="projectCreateFormGroup">
          <label className="projectCreateLabel">締切日</label>
          <input
            type="date"
            className="projectCreateInput"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="projectCreateActions">
          <button
            className="projectCreateBackButton"
            onClick={() => navigate("/projects")}
          >
            戻る
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="projectCreateButton"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
