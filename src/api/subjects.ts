import { apiRequest } from "./client";
import type {
  SubjectCreateBody,
  SubjectOut,
  SubjectUpdateBody,
} from "../types/admin";

const PREFIX = "/admin/subjects";

export async function listSubjects(): Promise<SubjectOut[]> {
  return apiRequest<SubjectOut[]>(PREFIX, { method: "GET" });
}

export async function createSubject(body: SubjectCreateBody): Promise<SubjectOut> {
  return apiRequest<SubjectOut>(PREFIX, {
    method: "POST",
    body,
  });
}

export async function updateSubject(
  subjectId: number,
  body: SubjectUpdateBody,
): Promise<SubjectOut> {
  return apiRequest<SubjectOut>(`${PREFIX}/${subjectId}`, {
    method: "PUT",
    body,
  });
}
