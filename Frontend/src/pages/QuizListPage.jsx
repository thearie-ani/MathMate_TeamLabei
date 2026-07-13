import { Link } from "react-router-dom";

export default function QuizListPage() {
  const quizzes = [
    { id: 1, title: "Limits & Continuity", icon: "∑", difficulty: "EASY", diffClass: "diff-easy", count: "15 Questions", time: "20 mins" },
    { id: 2, title: "Derivatives", icon: "📈", difficulty: "INTERMEDIATE", diffClass: "diff-medium", count: "20 Questions", time: "30 mins" },
    { id: 3, title: "Applications", icon: "△", difficulty: "EASY", diffClass: "diff-easy", count: "10 Questions", time: "15 mins" },
    { id: 4, title: "Integrals", icon: "∫", difficulty: "ADVANCED", diffClass: "diff-hard", count: "12 Questions", time: "45 mins" },
    { id: 5, title: "Applications", icon: "△", difficulty: "EASY", diffClass: "diff-easy", count: "10 Questions", time: "15 mins" },
    { id: 6, title: "Derivatives", icon: "📈", difficulty: "INTERMEDIATE", diffClass: "diff-medium", count: "20 Questions", time: "30 mins" },
  ];

  return (
    <div className="page quiz-list-page">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '32px'}}>
         <h1 className="page-title" style={{margin:0}}>Topic Quizzes</h1>
         <Link to="/quizzes/all" style={{fontSize:'14px', fontWeight:'600'}}>View All Topics</Link>
      </div>

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card card">
            <div className="quiz-card-header">
               <div className="quiz-icon">{quiz.icon}</div>
               <div className={`quiz-difficulty ${quiz.diffClass}`}>{quiz.difficulty}</div>
            </div>
            <h3>{quiz.title}</h3>
            <p className="quiz-meta">{quiz.count} • {quiz.time}</p>
            <Link to={`/quizzes/${quiz.id}`} className="quiz-card-link">Start Practice</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
