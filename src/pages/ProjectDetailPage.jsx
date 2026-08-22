import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProjectDetailPage.css";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [addTaskError, setAddTaskError] = useState(null);
  const [taskNameError, setTaskNameError] = useState(null);
  const [taskDueDateError, setTaskDueDateError] = useState(null);
  const [editTaskError, setEditTaskError] = useState(null);
  const [editTaskNameError, setEditTaskNameError] = useState(null);
  const [editTaskDueDateError, setEditTaskDueDateError] = useState(null);

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const projectDetailApiUrl = `${API_BASE_URL}/projects/${projectId}`;

  const fetchProject = async ({ showLoading = false } = {}) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      setError(null);

      const res = await fetch(projectDetailApiUrl);

      if (!res.ok) {
        throw new Error("プロジェクトの取得に失敗しました");
      }

      const data = await res.json();

      setProject(data);
      setTasks(data.tasks ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProject({ showLoading: true });
  }, [projectDetailApiUrl]);

  const openDeleteModal = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteError(null);
  };

  const openAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
    setTaskName("");
    setTaskDueDate("");
    setAddTaskError(null);
    setTaskNameError(null);
    setTaskDueDateError(null);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(projectDetailApiUrl, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("削除に失敗しました");
      }

      setIsDeleteModalOpen(false);
      navigate("/projects", {
        state: { message: "プロジェクトを削除しました" },
      });
    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setIsDeleting(false);
    }
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

  const handleAddTask = async (e) => {
    e.preventDefault();

    setAddTaskError(null);
    setTaskNameError(null);
    setTaskDueDateError(null);

    let hasError = false;

    if (!taskName.trim()) {
      setTaskNameError("タスク名を入力してください");
      hasError = true;
    }

    if (!taskDueDate) {
      setTaskDueDateError("締切日を入力してください");
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: taskName,
          due_date: taskDueDate,
          status: "not_started",
        }),
      });

      if (!res.ok) {
        throw new Error("タスクの追加に失敗しました");
      }

      closeAddTaskModal();
      await fetchProject();
    } catch (e) {
      console.error("タスクの追加に失敗しました", e);
      setAddTaskError("タスクの追加に失敗しました");
    }
  };

  const handleToggleTaskStatus = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("タスクの状態の更新に失敗しました");
      }

      await fetchProject();
    } catch (e) {
      console.error(e);
    }
  };

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setEditTaskName(task.name);
    setEditTaskDueDate(task.due_date);
    setIsEditTaskModalOpen(true);
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    setEditTaskError(null);
    setEditTaskNameError(null);
    setEditTaskDueDateError(null);

    let hasError = false;

    if (!editTaskName.trim()) {
      setEditTaskNameError("タスク名を入力してください");
      hasError = true;
    }

    if (!editTaskDueDate) {
      setEditTaskDueDateError("締切日を入力してください");
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${selectedTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editTaskName,
          due_date: editTaskDueDate,
        }),
      });

      if (!res.ok) {
        throw new Error("タスクの更新に失敗しました");
      }

      setIsEditTaskModalOpen(false);
      await fetchProject();
    } catch (e) {
      console.error("タスクの更新に失敗しました", e);
      setEditTaskError("タスクの更新に失敗しました");
    }
  };

  const closeEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setSelectedTask(null);
    setEditTaskName("");
    setEditTaskDueDate("");
    setEditTaskError(null);
    setEditTaskNameError(null);
    setEditTaskDueDateError(null);
  };

  const handleChangeTaskStatus = async (taskId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      });

      if (!res.ok) {
        throw new Error("ステータスの更新に失敗しました");
      }

      await fetchProject();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page">
      <div className="pageContainer">
        <div className="detailHeader">
          <h1 className="detailTitle">プロジェクト詳細</h1>
          <Link to="/projects" className="backLink">
            プロジェクト一覧に戻る
          </Link>
        </div>

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
                <div className="progressHeader">
                  <span className="progressLabel">進捗</span>
                  <span className="progressPercent">{progressPercent}%</span>
                </div>

                <div className="progressBar">
                  <div
                    className="progressBarFill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="projectActions">
              <Link to={`/projects/${project.id}/edit`} className="editLink">
                <button className="actionButton" type="button">
                  <span className="actionIcon">✏️</span>
                  プロジェクト編集
                </button>
              </Link>

              <button
                onClick={openDeleteModal}
                className="actionButton"
                type="button"
              >
                <span className="actionIcon">🗑️</span>
                プロジェクト削除
              </button>
            </div>
          </div>
        </div>

        <div className="taskHeader">
          <h2 className="taskTitle">タスク一覧</h2>
          <button
            type="button"
            className="addTaskButton"
            onClick={openAddTaskModal}
          >
            <span className="addTaskButton__icon">＋</span>
            <span className="addTaskButton__text">タスク追加</span>
          </button>
        </div>

        {isAddTaskModalOpen && (
          <div className="modalOverlay" onClick={closeAddTaskModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modalTitle">タスク追加</h2>
              <form className="modalForm" onSubmit={handleAddTask}>
                {addTaskError && <p className="modalError">{addTaskError}</p>}
                <div className="modalField">
                  <label htmlFor="taskName">タスク名</label>
                  <input
                    id="taskName"
                    type="text"
                    placeholder="タスク名を入力"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </div>
                {taskNameError && <p className="fieldError">{taskNameError}</p>}

                <div className="modalField">
                  <label htmlFor="taskDueDate">締切日</label>
                  <input
                    id="taskDueDate"
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
                {taskDueDateError && (
                  <p className="fieldError">{taskDueDateError}</p>
                )}

                <div className="modalActions">
                  <button type="button" onClick={closeAddTaskModal}>
                    キャンセル
                  </button>
                  <button type="submit">追加</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="card taskCard">
          <div className="taskTableContainer">
            <table className="table taskTable">
              <thead>
                <tr>
                  <th className="colTaskName">タスク名</th>
                  <th className="colTaskStatus">ステータス</th>
                  <th className="colTaskProgress">進捗</th>
                  <th className="colTaskCreated">作成日</th>
                  <th className="colTaskDue">締切日</th>
                  <th className="colTaskAssignee">担当者</th>
                  <th className="colTaskAction">操作</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="taskNameCell">{task.name}</td>

                    <td className="taskStatusCell">
                      <select
                        className={`taskStatusSelect status-${task.status ?? "not_started"}`}
                        onChange={(e) =>
                          handleChangeTaskStatus(task.id, e.target.value)
                        }
                      >
                        <option value="not_started">未着手</option>
                        <option value="in_progress">進行中</option>
                        <option value="in_review">レビュー中</option>
                        <option value="completed">完了</option>
                      </select>
                    </td>

                    <td className="taskProgressCell">—</td>

                    <td className="taskCreatedCell">
                      {task.created_at
                        ? new Date(task.created_at).toLocaleDateString("ja-JP")
                        : "—"}
                    </td>

                    <td className="taskDueCell">{task.due_date ?? "—"}</td>

                    <td className="taskAssigneeCell">—</td>

                    <td className="taskActionCell">
                      <button
                        className="editTaskButton"
                        onClick={() => openEditTaskModal(task)}
                        type="button"
                      >
                        編集
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isEditTaskModalOpen && (
            <div className="modalOverlay" onClick={closeEditTaskModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modalTitle">タスク編集</h2>

                <form onSubmit={handleEditTask}>
                  {editTaskError && (
                    <p className="modalError">{editTaskError}</p>
                  )}

                  <div className="modalField">
                    <label htmlFor="editTaskName">タスク名</label>
                    <input
                      id="editTaskName"
                      type="text"
                      value={editTaskName}
                      onChange={(e) => setEditTaskName(e.target.value)}
                    />
                  </div>
                  {editTaskNameError && (
                    <p className="fieldError">{editTaskNameError}</p>
                  )}

                  <div className="modalField">
                    <label htmlFor="editTaskDueDate">締切日</label>
                    <input
                      id="editTaskDueDate"
                      type="date"
                      value={editTaskDueDate}
                      onChange={(e) => setEditTaskDueDate(e.target.value)}
                    />
                  </div>
                  {editTaskDueDateError && (
                    <p className="fieldError">{editTaskDueDateError}</p>
                  )}

                  <div className="modalActions">
                    <button type="button" onClick={closeEditTaskModal}>
                      キャンセル
                    </button>
                    <button type="submit">更新</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {isDeleteModalOpen && (
          <div className="modalOverlay">
            <div className="modal">
              <p>本当に削除しますか？</p>
              {deleteError && <p className="modalError">{deleteError}</p>}
              <div className="modalActions">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "削除中..." : "OK"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
