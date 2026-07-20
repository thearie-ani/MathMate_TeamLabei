import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard } from "../api/dashboardApi";

export const useStudentDashboard = () =>
  useQuery({
    queryKey: ["studentDashboard"],
    queryFn: getStudentDashboard,
  });