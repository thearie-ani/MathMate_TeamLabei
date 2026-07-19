import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";

import { userApi } from "../../api/userApi.js";
import { quizApi } from "../../api/quizApi.js";
import { ScoreBadge } from "../../components/common/badge.jsx";
import { Card } from "../../components/common/card.jsx";
import { formatDate } from "../../utils/formatDate.js";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["adminUser", id],
    queryFn: async () => (await userApi.getUserById(id)).data.data.user,
  });

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["userSubmissions", id],
    queryFn: async () => (await quizApi.getStudentQuizHistory(id)).data.data.submissions,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="w-9 h-9 rounded-xl border border-[#e8e4f8] flex items-center justify-center text-gray-500 hover:bg-[#f8f7ff]"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-xl font-bold text-[#1a1535]">User Profile</h1>
      </div>

      <Card className="p-6 mb-4">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-200 to-violet-200 flex items-center justify-center text-2xl font-bold text-violet-700 flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-[#1a1535]">{user?.username}</h2>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  user?.role === "admin" ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-blue-50 text-blue-600 border-blue-200"
                }`}
              >
                {user?.role}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  user?.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-500 border-red-200"
                }`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  user?.isVerified ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {user?.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {user?.bio && <p className="text-sm text-gray-400 mt-2 italic">{user.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-[#e8e4f8]">
          {[
            { label: "Joined", value: formatDate(user?.createdAt) },
            { label: "Last Seen", value: formatDate(user?.lastSeen) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-sm font-semibold text-[#1a1535]">{value}</p>
            </div>
          ))}
        </div>

        {user?.learningStreak?.current > 0 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-sm font-semibold text-orange-800">{user.learningStreak.current} day streak</p>
              <p className="text-xs text-orange-600">Longest: {user.learningStreak.longest} days</p>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-bold text-[#1a1535] mb-4">Recent Quiz Activity</h3>
        {isLoadingSubmissions ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !submissions?.length ? (
          <p className="text-sm text-gray-400 text-center py-8">No quiz submissions yet</p>
        ) : (
          <div className="divide-y divide-[#f0eeff]">
            {submissions.map((s) => (
              <div key={s._id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-[#1a1535] font-medium">{s.quiz?.title || "Untitled quiz"}</span>
                  <p className="text-xs text-gray-400">
                    Attempt #{s.attemptNumber || 1} · {formatDate(s.createdAt)}
                  </p>
                </div>
                <ScoreBadge score={s.score} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}