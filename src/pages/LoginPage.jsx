import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "ログインに失敗しました。");
        return;
      }

      navigate("/projects");
    } catch (error) {
      setError("通信に失敗しました。");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h1 className="loginTitle">プロジェクト管理システム</h1>

        <p className="loginSubtitle">
          プロジェクトとタスクをシンプルに管理
        </p>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p>{error}</p>}

          <button
            type="submit"
            className="loginButton"
          >
            ログイン
          </button>
        </form>

        <button
          type="button"
          className="registerButton"
          onClick={() => navigate("/register")}
        >
          ユーザー登録
        </button>
      </div>
    </div>
  );
}