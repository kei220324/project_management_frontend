import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== passwordConfirmation) {
    setError("パスワードと確認用パスワードが一致しません。");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      setError(data.message || "ユーザー登録に失敗しました。");
      return;
    }

    navigate("/login");
  } catch (error) {
    console.error(error);
    setError("通信に失敗しました。");
  }
};



  return (
    <div className="registerPage">
      <div className="registerCard">
        <h1 className="registerTitle">ユーザー登録</h1>

        <p className="registerSubtitle">
          アカウントを作成して
          <br />
          プロジェクト管理を始めましょう
        </p>

        <form onSubmit={handleRegister}>
          <div className="registerFormGroup">
            <label htmlFor="name">名前</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力してください"
              required
            />
          </div>

          <div className="registerFormGroup">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="registerFormGroup">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              required
            />
          </div>

          <div className="registerFormGroup">
            <label htmlFor="passwordConfirmation">パスワード（確認）</label>
            <input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="もう一度入力してください"
              required
            />
          </div>

          {error && <p className="registerError">{error}</p>}

          <button type="submit" className="registerSubmitButton">
            アカウントを作成
          </button>
        </form>

        <div className="registerLoginLink">
          <span>すでにアカウントをお持ちですか？</span>

          <button type="button" onClick={() => navigate("/login")}>
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
}
