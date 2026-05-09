import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  const handleGoToProjects = () => {
    navigate("/projects");
  };

  return (
    <div className="homePage">
      <div className="homeCard">
        <h1 className="homeTitle">プロジェクト管理システム</h1>

        <p className="homeSubtitle">
          プロジェクトとタスクをシンプルに管理
        </p>

        <button
          type="button"
          className="homeButton"
          onClick={handleGoToProjects}
        >
          アプリを見る
        </button>
      </div>
    </div>
  );
}