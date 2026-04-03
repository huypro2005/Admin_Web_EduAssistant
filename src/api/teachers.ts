import { apiRequest } from "./client";
import type { TeacherOut } from "../types/admin";

const PREFIX = "/admin/teachers";

export async function listTeachers(): Promise<TeacherOut[]> {
  return apiRequest<TeacherOut[]>(PREFIX, { method: "GET" });
}
