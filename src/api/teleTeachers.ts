import { apiRequest } from "./client";
import type { TeleTeacherCreateBody, TeleTeacherOut } from "../types/admin";

const PREFIX = "/admin/tele-teachers";

export async function listTeleTeachers(): Promise<TeleTeacherOut[]> {
  return apiRequest<TeleTeacherOut[]>(PREFIX, { method: "GET" });
}

export async function createTeleTeacher(
  body: TeleTeacherCreateBody,
): Promise<TeleTeacherOut> {
  return apiRequest<TeleTeacherOut>(PREFIX, {
    method: "POST",
    body,
  });
}

export async function deleteTeleTeacher(recordId: number): Promise<void> {
  await apiRequest<void>(`${PREFIX}/${recordId}`, { method: "DELETE" });
}
