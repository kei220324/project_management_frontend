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

  const [isTaskEditing, setIsTaskEditing] = useState(false);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskCheckItems, setTaskCheckItems] = useState([]);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(null);

  const [isAddingCheckItem, setIsAddingCheckItem] = useState(false);
  const [newCheckItemTitle, setNewCheckItemTitle] = useState("");

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
      return data;
    } catch (e) {
      setError(e.message);
      return null;
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
          description: description,
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

  // const handleToggleTaskStatus = async (taskId) => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/toggle`, {
  //       method: "PATCH",
  //     });

  //     if (!res.ok) {
  //       throw new Error("タスクの状態の更新に失敗しました");
  //     }

  //     await fetchProject();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const startTaskEditing = (task) => {
   
    setEditTaskName(task.name ?? "");
    
    setEditTaskDescription(task.description ?? "");
    setEditTaskDueDate(task.due_date ?? "");
    // setEditTaskError(null);
    // setEditTaskNameError(null);
    // setEditTaskDueDateError(null);
    setIsTaskEditing(true);
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
          description: editTaskDescription,
          due_date: editTaskDueDate,
        }),
      });

      if (!res.ok) {
        throw new Error("タスクの更新に失敗しました");
      }

      const updatedTask = await res.json();
      const refreshedProject = await fetchProject();
      const refreshedTask = refreshedProject?.tasks?.find(
        (task) => task.id === updatedTask.id,
      );

      setSelectedTask(refreshedTask ?? updatedTask);
      setIsTaskEditing(false);
    } catch (e) {
      console.error("タスクの更新に失敗しました", e);
      setEditTaskError("タスクの更新に失敗しました");
    }
  };

  const cancelTaskEditing = () => {
    setIsTaskEditing(false);
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

      const updatedTask = await res.json();
      const refreshedProject = await fetchProject();
      const refreshedTask = refreshedProject?.tasks?.find(
        (task) => task.id === updatedTask.id,
      );

      if (selectedTask?.id === updatedTask.id) {
        setSelectedTask(refreshedTask ?? updatedTask);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openTaskDetailPanel = (task) => {
    console.log(task);
    setSelectedTask(task);
    setIsTaskEditing(false);
    setEditTaskError(null);
    setEditTaskNameError(null);
    setEditTaskDueDateError(null);
    fetchTaskCheckItems(task.id);
  };

  const closeTaskDetailPanel = () => {
    setSelectedTask(null);
    cancelTaskEditing();
  };

  const fetchTaskCheckItems = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/check-items`);
      if (!res.ok) {
        throw new Error("チェック項目の取得に失敗しました");
      }
      const data = await res.json();
      setTaskCheckItems(data);
    } catch (e) {
      console.error("チェック項目の取得に失敗しました", e);
    }
  };

  const openAddCheckItemInput = () => {
    setIsAddingCheckItem(true);
  };

  const addCheckItem = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/check-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newCheckItemTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message ?? "チェック項目の追加に失敗しました");
      }

      // 最新のチェックリストを再取得する
      await fetchTaskCheckItems(taskId);

      // 入力欄を空にする
      setNewCheckItemTitle("");

      // 追加用の入力欄を閉じる
      setIsAddingCheckItem(false);
    } catch (e) {
      console.error("チェック項目の追加に失敗しました", e);
    }
  };

  const deleteCheckItem = async (checkItemId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/tasks/${selectedTask.id}/check-items/${checkItemId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error("チェック項目の削除に失敗しました");
      }

      // 削除後の最新チェックリストを取得
      await fetchTaskCheckItems(selectedTask.id);
    } catch (e) {
      console.error("チェック項目の削除に失敗しました", e);
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

                <div className="formGroup">
                  <label htmlFor="editTaskDescription">概要（任意）</label>
                  <textarea
                    id="TaskDescription"
                    value={editTaskDescription}
                    onChange={(e) => setEditTaskDescription(e.target.value)}
                    placeholder="タスクの内容や完了条件を入力"
                    rows={4}
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

                    <td className="taskDueCell">{task.due_date ?? "—"}</td>

                    <td className="taskAssigneeCell">—</td>

                    <td className="taskActionCell">
                      <button
                        type="button"
                        className="taskDetailButton"
                        onClick={() => openTaskDetailPanel(task)}
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedTask && (
            <>
              <div
                className="taskDetailOverlay"
                onClick={closeTaskDetailPanel}
              />

              <aside className="taskDetailPanel">
                {!isTaskEditing ? (
                  <>
                    {/* 詳細画面 */}
                    <header className="taskDetailHeader">
                      <h2 className="taskDetailTitle">{selectedTask.name}</h2>

                      <button
                        type="button"
                        className="taskDetailCloseButton"
                        onClick={closeTaskDetailPanel}
                        aria-label="詳細を閉じる"
                      >
                        ×
                      </button>
                    </header>

                    {/* 概要 */}
                    <section className="taskDetailSection">
                      <h3 className="taskDetailSectionTitle">概要</h3>

                      <p className="taskDetailDescription">
                        {selectedTask.description || "概要はありません"}
                      </p>
                    </section>

                    {/* ステータス・進捗 */}
                    <section className="taskDetailSection">
                      <div className="taskDetailStatusRow">
                        <h3 className="taskDetailSectionTitle">ステータス</h3>
                        {selectedTask.status}
                      </div>

                      <div className="taskDetailProgressHeader">
                        <span>進捗</span>
                        <span>{selectedTask.progress_percent ?? 0}%</span>
                      </div>

                      <div className="taskDetailProgressBar">
                        <div
                          className="taskDetailProgressValue"
                          style={{
                            width: `${selectedTask.progress_percent ?? 0}%`,
                          }}
                        />
                      </div>
                    </section>

                    {/* チェックリスト */}
                    <section className="taskDetailSection">
                      <h3 className="taskDetailSectionTitle">
                        作業チェックリスト
                      </h3>

                      {taskCheckItems.length === 0 ? (
                        <p>チェック項目はありません</p>
                      ) : (
                        <ul className="taskCheckItemList">
                          {taskCheckItems.map((item) => (
                            <li key={item.id} className="taskCheckItem">
                              <div className="taskCheckItemContent">
                                <input
                                  type="checkbox"
                                  checked={item.is_done}
                                  readOnly
                                />

                                <span>{item.title}</span>
                              </div>

                              <button
                                type="button"
                                className="taskCheckItemDeleteButton"
                                onClick={() => deleteCheckItem(item.id)}
                                aria-label={`${item.title}を削除`}
                              >
                                🗑️
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      {isAddingCheckItem ? (
                        <div className="checkItemAddForm">
                          <input
                            type="text"
                            value={newCheckItemTitle}
                            onChange={(e) =>
                              setNewCheckItemTitle(e.target.value)
                            }
                            placeholder="項目名を入力"
                            autoFocus
                          />

                          <button
                            type="button"
                            onClick={() => addCheckItem(selectedTask.id)}
                          >
                            追加
                          </button>

                          {/* 
                <button
                  type="button"
                  onClick={cancelAddCheckItem}
                >
                  キャンセル
                </button>
                */}
                        </div>
                      ) : (
                        <button type="button" onClick={openAddCheckItemInput}>
                          ＋ 項目を追加
                        </button>
                      )}
                    </section>

                    {/* タスク情報 */}
                    <section className="taskDetailSection">
                      <dl className="taskDetailInfoList">
                        <div>
                          <dt>担当者</dt>
                          <dd>{selectedTask.assignee ?? "—"}</dd>
                        </div>

                        <div>
                          <dt>締切日</dt>
                          <dd>{selectedTask.due_date ?? "—"}</dd>
                        </div>
                      </dl>
                    </section>

                    {/* 操作ボタン */}
                    <footer className="taskDetailActions">

                         <button
                        type="button"
                        onClick={() => startTaskEditing(selectedTask)}
                      >
                        タスク編集
                      </button>
                    
                      <button
                        type="button"
                        onClick={() => startTaskEditing(selectedTask)}
                      >
                        タスク編集
                      </button>
                    </footer>
                  </>
                ) : (
                  <form
                    className="taskDetailEditForm"
                    onSubmit={handleEditTask}
                  >
                    {/* 編集画面 */}
                    <header className="taskDetailHeader">
                      <h2 className="taskDetailTitle">タスク編集</h2>

                      <button
                        type="button"
                        className="taskDetailCloseButton"
                        onClick={closeTaskDetailPanel}
                        aria-label="詳細を閉じる"
                      >
                        ×
                      </button>
                    </header>

                    {editTaskError && (
                      <p className="modalError">{editTaskError}</p>
                    )}

                    {/* タスク名 */}
                    <div className="taskDetailEditField">
                      <label htmlFor="editTaskName">タスク名</label>

                      <input
                        id="editTaskName"
                        type="text"
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        autoFocus
                      />
                    </div>

                    {editTaskNameError && (
                      <p className="fieldError">{editTaskNameError}</p>
                    )}

                    {/* 概要 */}
                    <div className="taskDetailEditField">
                      <label htmlFor="editTaskDescription">概要</label>

                      <textarea
                        id="editTaskDescription"
                        value={editTaskDescription}
                        onChange={(e) => setEditTaskDescription(e.target.value)}
                        placeholder="概要を入力してください"
                        rows={4}
                      />
                    </div>

                    {descriptionError && (
                      <p className="fieldError">{descriptionError}</p>
                    )}

                    {/* 締切日 */}
                    <div className="taskDetailEditField">
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

                    {/* 編集操作 */}
                    <div className="taskDetailActions">
                      <button type="button" onClick={cancelTaskEditing}>
                        キャンセル
                      </button>

                      <button type="submit">更新</button>
                    </div>
                  </form>
                )}
              </aside>
            </>
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
