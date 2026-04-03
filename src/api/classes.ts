import { apiRequest } from "./client";
import type {
  ClassCreateBody,
  ClassOut,
  HomeroomUpdateBody,
  StudentOut,
  SubjectClassOut,
} from "../types/admin";

const PREFIX = "/admin/classes";

export async function listClasses(): Promise<ClassOut[]> {
  return apiRequest<ClassOut[]>(PREFIX, { method: "GET" });
}

export async function createClass(body: ClassCreateBody): Promise<ClassOut> {
  return apiRequest<ClassOut>(PREFIX, {
    method: "POST",
    body,
  });
}

export async function updateClassHomeroom(
  classId: number,
  body: HomeroomUpdateBody,
): Promise<ClassOut> {
  return apiRequest<ClassOut>(`${PREFIX}/${classId}/homeroom`, {
    method: "PUT",
    body,
  });
}

export async function listClassStudents(classId: number): Promise<StudentOut[]> {
  return apiRequest<StudentOut[]>(`${PREFIX}/${classId}/students`, {
    method: "GET",
  });
}

export async function listClassSubjectClasses(
  classId: number,
): Promise<SubjectClassOut[]> {
  return apiRequest<SubjectClassOut[]>(`${PREFIX}/${classId}/subject-classes`, {
    method: "GET",
  });
}
