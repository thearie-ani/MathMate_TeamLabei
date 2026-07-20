import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, AlertTriangle, ClipboardList } from "lucide-react";
import { quizApi } from "../../api/quizApi.js";
import QuizCard from "../../components/common/quizCard.jsx";

export default function QuizzesPage() {
  const [search, setSearch] = useState("");

  const {
    data: quizzes,
    isLoading: quizzesLoading,
    isError: quizzesErrored,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () =>
      (await quizApi.getAllQuizzes()).data.data.quizzes,
  });

  // Student's own quiz submission history
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyErrored,
  } = useQuery({
    queryKey: ["quizHistory"],
    queryFn: async () =>
      (await quizApi.getMyQuizHistory()).data.data.submissions,
  });

  const submissionByQuizId = useMemo(() => {
    const map = {};

    for (const submission of history || []) {
      const quizId = submission.quiz?._id || submission.quiz;

      if (quizId) {
        map[quizId] = submission;
      }
    }

    return map;
  }, [history]);

  const filteredQuizzes = useMemo(
    () =>
      (quizzes || []).filter((quiz) =>
        quiz.title?.toLowerCase().includes(search.toLowerCase())
      ),
    [quizzes, search]
  );

  const isLoading = quizzesLoading || historyLoading;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1535]">
          Quizzes
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Test what you've learned
        </p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes by title..."
          aria-label="Search quizzes"
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#eee7ff] rounded-xl bg-white
          focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-[#8b5cf6] transition"
        />
      </div>

      {quizzesErrored || historyErrored ? (
        <div className="py-20 text-center">
          <AlertTriangle
            size={28}
            className="mx-auto mb-3 text-red-400"
          />
          <p className="text-sm text-gray-500">
            Couldn't load quizzes right now. Please refresh the page.
          </p>
        </div>
      ) : isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-busy="true"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#eee7ff] rounded-2xl p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gray-100" />
                <div className="h-4 w-2/3 bg-gray-100 rounded" />
              </div>

              <div className="h-3 w-full bg-gray-100 rounded mb-2" />

              <div className="h-10 w-full bg-gray-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="py-20 text-center">
          <ClipboardList
            size={32}
            className="mx-auto mb-3 text-gray-300"
          />

          <p className="text-sm text-gray-500">
            {search
              ? "No quizzes match your search."
              : "No quizzes are available yet — check back soon."}
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-sm font-semibold text-[#8b5cf6] hover:text-[#7c3aed]"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              submission={submissionByQuizId[quiz._id] || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}