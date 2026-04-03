/** Telegram whitelist row */
export interface TeleTeacherOut {
  id: number;
  telegram_id: string;
  username: string | null;
}

export interface TeleTeacherCreateBody {
  telegram_id: string;
  username?: string | null;
}

/** Lớp — dùng trong TeacherOut.homeroom_classes và GET /admin/classes */
export interface ClassOut {
  id: number;
  name: string;
  total_students: number;
  homeroom_teacher_id: number | null;
  homeroom_teacher_name: string | null;
}

export interface TeacherOut {
  id: number;
  telegram_id: string | null;
  username: string | null;
  full_name: string | null;
  is_active: boolean;
  homeroom_classes: ClassOut[];
}

export interface SubjectOut {
  id: number;
  name: string;
  description: string | null;
}

export interface SubjectCreateBody {
  name: string;
  description?: string | null;
}

export interface SubjectUpdateBody {
  name?: string;
  description?: string | null;
}

export interface ClassCreateBody {
  name: string;
  homeroom_teacher_id?: number | null;
}

export interface HomeroomUpdateBody {
  homeroom_teacher_id: number | null;
}

export interface StudentOut {
  id: number;
  telegram_id?: string | null;
  username?: string | null;
  full_name?: string | null;
  is_active?: boolean;
  /** Backend có thể trả thêm field; giữ mở rộng */
  [key: string]: unknown;
}

/**
 * Phân bổ môn–lớp–GV. Backend có thể bổ sung tên hiển thị.
 * @see GET /admin/subject-classes
 */
export interface SubjectClassOut {
  id: number;
  subject_id: number;
  class_id: number;
  teacher_id: number | null;
  subject_name?: string;
  class_name?: string;
  teacher_name?: string | null;
}

export interface SubjectClassCreateBody {
  subject_id: number;
  class_id: number;
  teacher_id?: number | null;
}

export interface SubjectClassTeacherBody {
  teacher_id: number | null;
}
