import { delay, lessons } from "./mockApi";

export const getLessons = async () => delay({ data: lessons });

export const getLessonById = async (id) => {
  const lesson = lessons.find((item) => String(item.id) === String(id)) ?? null;
  return delay({ data: lesson });
};
