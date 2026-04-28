import "./ProjectCreatePage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCreatePage() {
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setNameError(null);

    let hasError = false;

    if (!name.trim()) {
      setNameError("プロジェクト名は必須です");
      hasError = true;
    }

    if (hasError) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
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
      setErrorMessage("プロジェクトの追加に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="projectCreatePage">
      <div className="projectCreateCard">
        <h1 className="projectCreateTitle">プロジェクト追加</h1>
        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="errorMessage">{errorMessage}</p>}

          <div className="projectCreateFormGroup">
            <label className="projectCreateLabel">プロジェクト名</label>
            <input
              type="text"
              className="projectCreateInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="fieldError">{nameError}</p>}
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
              type="button"
              className="projectCreateBackButton"
              onClick={() => navigate("/projects")}
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="projectCreateButton"
              disabled={isSubmitting}
            >
              {isSubmitting ? "追加中..." : "追加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
