import { apiRequest } from "./client";
import type {
  SubjectClassCreateBody,
  SubjectClassOut,
  SubjectClassTeacherBody,
} from "../types/admin";

const PREFIX = "/admin/subject-classes";

export async function listSubjectClasses(
  classId?: number,
): Promise<SubjectClassOut[]> {
  const q =
    classId !== undefined
      ? `?class_id=${encodeURIComponent(String(classId))}`
      : "";
  return apiRequest<SubjectClassOut[]>(`${PREFIX}${q}`, { method: "GET" });
}

export async function createSubjectClass(
  body: SubjectClassCreateBody,
): Promise<SubjectClassOut> {
  return apiRequest<SubjectClassOut>(PREFIX, {
    method: "POST",
    body,
  });
}

export async function updateSubjectClassTeacher(
  subjectClassId: number,
  body: SubjectClassTeacherBody,
): Promise<SubjectClassOut> {
  return apiRequest<SubjectClassOut>(
    `${PREFIX}/${subjectClassId}/teacher`,
    {
      method: "PUT",
      body,
    },
  );
}
