import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProjectDetailPage.css";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [taskName, setTaskName] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  const projectApiUrl = `http://localhost/api/projects/${projectId}`;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(projectApiUrl);

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
  }, [projectApiUrl]);

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
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(projectApiUrl, {
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

  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;

    const doneCount = tasks.filter((task) => task.is_done).length;
    return Math.floor((doneCount / tasks.length) * 100);
  };

  const progressPercent = calculateProgress(tasks);

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost/api/projects/${projectId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskName,
            due_date: taskDueDate,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("タスクの追加に失敗しました");
      }

      const newTask = await res.json();

      setTasks((prevTasks) => [...prevTasks, newTask]);

      setTaskName("");
      setTaskDueDate("");
      closeAddTaskModal();
    } catch (e) {
      console.error("タスクの追加に失敗しました", e);
      alert("タスクの追加に失敗しました");
    }
  };

  const handleToggleTaskStatus = async (taskId) => {
    try {
      const res = await fetch(`http://localhost/api/tasks/${taskId}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("タスクの状態の更新に失敗しました");
      }

      const updateTask = await res.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updateTask.id ? updateTask : task,
        ),
      );
    } catch (e) {
      console.error(e);
    }
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
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="projectActions">
            <Link to={`/projects/${project.id}/edit`} className="editLink">
              <button className="actionButton" type="button">
                <span className="actionIcon">✏️</span>
                編集
              </button>
            </Link>

            <button
              onClick={openDeleteModal}
              className="actionButton"
              type="button"
            >
              <span className="actionIcon">🗑️</span>
              削除
            </button>

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
      </div>

      {/* タスク一覧ヘッダー */}
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

      {/* タスク追加モーダル */}
      {isAddTaskModalOpen && (
        <div className="modalOverlay" onClick={closeAddTaskModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modalTitle">タスク追加</h2>
            <form className="modalForm" onSubmit={handleAddTask}>
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

              <div className="modalField">
                <label htmlFor="taskDueDate">締切日</label>
                <input
                  id="taskDueDate"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>

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
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      type="button"
                      className={`taskStatusButton ${task.is_done ? "isDone" : "isTodo"}`}
                    >
                      {task.is_done ? "完了" : "未完了"}
                    </button>
                  </td>
                  <td className="taskDueCell">{task.due_date}</td>
                  <td className="taskActionCell">
                    <button className="editTaskButton" type="button">
                      ✏️ 編集
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
