import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, AlertTriangle, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { courseApi } from "../../api/courseApi.js";
import CourseCard from "../../components/common/courseCard.jsx";

export default function CoursesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesErrored,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await courseApi.getAllCourses()).data.data.courses,
  });

  // Fetched once, separately from the course list, so enrolling doesn't
  // require refetching every course — only this smaller query needs to
  // invalidate. Avoids calling getCourseProgress once per card (N+1).
  const { data: myProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["myProgress"],
    queryFn: async () => (await courseApi.getMyProgress()).data.data.progress,
  });

  const progressByCourseId = useMemo(() => {
    const map = {};
    for (const p of myProgress || []) {
      const courseId = p.course?._id || p.course;
      if (courseId) map[courseId] = p;
    }
    return map;
  }, [myProgress]);

  const enrollMutation = useMutation({
    mutationFn: (course) => courseApi.enrollCourse(course._id),
    onSuccess: (_res, course) => {
      toast.success(`Enrolled in ${course.title}`);
      queryClient.invalidateQueries({ queryKey: ["myProgress"] });
      navigate(`/courses/${course.slug}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to enroll. Please try again.");
    },
  });

  const filteredCourses = useMemo(
    () => (courses || []).filter((c) => c.title?.toLowerCase().includes(search.toLowerCase())),
    [courses, search]
  );

  const isLoading = coursesLoading || progressLoading;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1535]">Courses</h1>
        <p className="text-sm text-gray-500 mt-0.5">Browse and continue your math courses</p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses by title..."
          aria-label="Search courses"
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#eee7ff] rounded-xl bg-white
          focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-[#8b5cf6] transition"
        />
      </div>

      {coursesErrored ? (
        <ErrorState />
      ) : isLoading ? (
        <SkeletonGrid />
      ) : filteredCourses.length === 0 ? (
        <EmptyState hasSearch={Boolean(search)} onClearSearch={() => setSearch("")} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              progress={progressByCourseId[course._id] || null}
              isEnrolling={enrollMutation.isPending && enrollMutation.variables?._id === course._id}
              onEnroll={(c) => enrollMutation.mutate(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-[#eee7ff] rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>
          <div className="h-3 w-full bg-gray-100 rounded mb-2" />
          <div className="h-3 w-3/4 bg-gray-100 rounded mb-5" />
          <div className="h-10 w-full bg-gray-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasSearch, onClearSearch }) {
  return (
    <div className="py-20 text-center">
      <BookOpen size={32} className="mx-auto mb-3 text-gray-300" />
      {hasSearch ? (
        <>
          <p className="text-sm text-gray-500">No courses match your search.</p>
          <button onClick={onClearSearch} className="mt-2 text-sm font-semibold text-[#8b5cf6] hover:text-[#7c3aed]">
            Clear search
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-500">No courses are available yet — check back soon.</p>
      )}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="py-20 text-center">
      <AlertTriangle size={28} className="mx-auto mb-3 text-red-400" />
      <p className="text-sm text-gray-500">Couldn't load courses right now. Please refresh the page.</p>
    </div>
  );
}