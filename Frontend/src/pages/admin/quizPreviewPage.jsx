
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { Pencil, Eye, Loader2, ArrowLeft, CheckCircle, XCircle, RefreshCw } from "lucide-react";

import {quizApi} from "../../api/quizApi.js";


import {GradientBtn, GhostBtn} from "../../components/common/button.jsx";
import {Card} from "../../components/common/card.jsx";


export default function QuizPreviewPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quizPreview", id],
    queryFn: async () => {
      const res = await quizApi.getQuizById(id);
      return res.data.data;
    },
  });

  const handleSubmit = () => setSubmitted(true);

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-violet-500" size={32} />
    </div>
  );

  const score = submitted
    ? Math.round(
        (quiz?.questions?.filter((q, i) => selected[i] === q.correctOptionIndex).length
          / quiz?.questions?.length) * 100
      )
    : null;

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-4 p-3 bg-violet-50 border border-violet-200 rounded-xl">
        <div className="flex items-center gap-2 text-violet-700 text-sm font-medium">
          <Eye size={15} /> Admin Preview — student quiz view
        </div>
        <div className="flex gap-2">
          <GhostBtn size="sm" onClick={() => navigate(`/admin/quizzes/${id}/edit`)}>
            <Pencil size={13} /> Edit
          </GhostBtn>
          <GhostBtn size="sm" onClick={() => navigate("/admin/quizzes")}>
            <ArrowLeft size={13} /> Back
          </GhostBtn>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-[#e8e4f8] bg-gradient-to-r from-[#f8f7ff] to-white">
          <h1 className="text-xl font-bold text-[#1a1535] mb-1">{quiz?.title}</h1>
          {quiz?.description && <p className="text-sm text-gray-500">{quiz.description}</p>}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span>{quiz?.questions?.length} questions</span>
            <span>·</span>
            <span>Passing: {quiz?.passingScore || 60}%</span>
          </div>
        </div>

        {submitted && (
          <div className={`p-4 m-4 rounded-xl text-center border ${
            score >= (quiz?.passingScore || 60)
              ? "bg-emerald-50 border-emerald-200"
              : "bg-red-50 border-red-200"
          }`}>
            <p className="text-2xl font-bold mb-1" style={{ color: score >= 60 ? "#10b981" : "#ef4444" }}>
              {score}%
            </p>
            <p className="text-sm font-medium" style={{ color: score >= 60 ? "#059669" : "#dc2626" }}>
              {score >= (quiz?.passingScore || 60) ? "✓ Passed" : "✗ Not passed"}
            </p>
          </div>
        )}

        <div className="p-4 space-y-5">
          {quiz?.questions?.map((q, qi) => {
            const isAnswered = selected[qi] !== undefined;
            const isCorrect = submitted && selected[qi] === q.correctOptionIndex;
            const isWrong = submitted && isAnswered && !isCorrect;

            return (
              <div key={qi} className={`p-4 rounded-xl border transition-all ${
                submitted
                  ? isCorrect ? "border-emerald-200 bg-emerald-50"
                  : isWrong ? "border-red-200 bg-red-50"
                  : "border-[#e8e4f8] bg-[#faf9ff]"
                  : "border-[#e8e4f8]"
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-violet-500
                  text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qi + 1}
                  </span>
                  <p className="text-sm font-semibold text-[#1a1535]">{q.questionText}</p>
                </div>

                <div className="ml-9 space-y-2">
                  {q.options.map((opt, oi) => {
                    const isThisCorrect = submitted && oi === q.correctOptionIndex;
                    const isThisSelected = selected[qi] === oi;
                    const isThisWrong = submitted && isThisSelected && !isThisCorrect;

                    return (
                      <label key={oi} className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer 
                      border transition-all text-sm ${
                        isThisCorrect ? "border-emerald-300 bg-emerald-100 text-emerald-800" :
                        isThisWrong ? "border-red-300 bg-red-100 text-red-800" :
                        isThisSelected ? "border-violet-300 bg-violet-50 text-violet-800" :
                        "border-[#e8e4f8] hover:border-violet-200 hover:bg-[#f8f7ff]"
                      }`}>
                        <input
                          type="radio"
                          name={`q${qi}`}
                          value={oi}
                          checked={isThisSelected}
                          disabled={submitted}
                          onChange={() => setSelected((p) => ({ ...p, [qi]: oi }))}
                          className="accent-violet-500"
                        />
                        <span>{opt}</span>
                        {isThisCorrect && <CheckCircle size={14} className="ml-auto text-emerald-600" />}
                        {isThisWrong && <XCircle size={14} className="ml-auto text-red-500" />}
                      </label>
                    );
                  })}
                </div>

                {submitted && q.explanation && (
                  <div className="ml-9 mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                    💡 {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#e8e4f8]">
          {!submitted ? (
            <GradientBtn onClick={handleSubmit} className="w-full justify-center">
              Submit Quiz
            </GradientBtn>
          ) : (
            <GhostBtn onClick={() => { setSelected({}); setSubmitted(false); }} className="w-full justify-center">
              <RefreshCw size={14} /> Retake Preview
            </GhostBtn>
          )}
        </div>
      </Card>
    </div>
  );
};
