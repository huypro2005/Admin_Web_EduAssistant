import { useCallback, useEffect, useState } from "react";
import * as subjectClassesApi from "../api/subjectClasses";
import * as classesApi from "../api/classes";
import * as subjectsApi from "../api/subjects";
import * as teachersApi from "../api/teachers";
import type {
  ClassOut,
  SubjectClassOut,
  SubjectOut,
  TeacherOut,
} from "../types/admin";
import { ErrorBanner } from "../components/ErrorBanner";

export function SubjectClassesPage() {
  const [classes, setClasses] = useState<ClassOut[]>([]);
  const [subjects, setSubjects] = useState<SubjectOut[]>([]);
  const [teachers, setTeachers] = useState<TeacherOut[]>([]);
  const [rows, setRows] = useState<SubjectClassOut[]>([]);
  const [filterClassId, setFilterClassId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [teacherPick, setTeacherPick] = useState<Record<number, string>>({});

  const loadMeta = useCallback(async () => {
    setError(null);
    try {
      const [c, s, t] = await Promise.all([
        classesApi.listClasses(),
        subjectsApi.listSubjects(),
        teachersApi.listTeachers(),
      ]);
      setClasses(c);
      setSubjects(s);
      setTeachers(t);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubjectClasses = useCallback(async () => {
    setLoadingRows(true);
    setError(null);
    try {
      const cid = filterClassId.trim();
      const data =
        cid === ""
          ? await subjectClassesApi.listSubjectClasses()
          : await subjectClassesApi.listSubjectClasses(
              Number.parseInt(cid, 10),
            );
      setRows(data);
      const next: Record<number, string> = {};
      for (const sc of data) {
        next[sc.id] =
          sc.teacher_id != null ? String(sc.teacher_id) : "";
      }
      setTeacherPick(next);
    } catch (e) {
      setError(e);
    } finally {
      setLoadingRows(false);
    }
  }, [filterClassId]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    if (!loading) void loadSubjectClasses();
  }, [loading, loadSubjectClasses]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const tid = teacherId.trim();
      await subjectClassesApi.createSubjectClass({
        subject_id: Number.parseInt(subjectId, 10),
        class_id: Number.parseInt(classId, 10),
        teacher_id: tid === "" ? null : Number.parseInt(tid, 10),
      });
      setSubjectId("");
      setClassId("");
      setTeacherId("");
      await loadSubjectClasses();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveTeacher(subjectClassId: number) {
    setError(null);
    const raw = teacherPick[subjectClassId] ?? "";
    const tid = raw.trim();
    try {
      await subjectClassesApi.updateSubjectClassTeacher(subjectClassId, {
        teacher_id: tid === "" ? null : Number.parseInt(tid, 10),
      });
      await loadSubjectClasses();
    } catch (err) {
      setError(err);
    }
  }

  function subjectLabel(sid: number) {
    return subjects.find((s) => s.id === sid)?.name ?? `môn #${sid}`;
  }

  function classLabel(cid: number) {
    return classes.find((c) => c.id === cid)?.name ?? `lớp #${cid}`;
  }

  return (
    <>
      <h1>Môn — lớp — giáo viên dạy</h1>
      <p className="subtle">
        Gán cặp môn–lớp và GV dạy:{" "}
        <code>POST /admin/subject-classes</code>,{" "}
        <code>PUT /admin/subject-classes/{"{id}"}/teacher</code>. Lọc theo lớp
        khuyến nghị khi dữ liệu lớn.
      </p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="card">
        <h2>Lọc danh sách</h2>
        <div className="form-row">
          <label>
            class_id
            <select
              value={filterClassId}
              onChange={(ev) => setFilterClassId(ev.target.value)}
            >
              <option value="">Tất cả (cẩn thận khi nhiều dữ liệu)</option>
              {classes.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.id} — {c.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => void loadSubjectClasses()}>
            Tải lại
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Thêm phân công</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <label>
              Môn *
              <select
                required
                value={subjectId}
                onChange={(ev) => setSubjectId(ev.target.value)}
              >
                <option value="">— Chọn —</option>
                {subjects.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Lớp *
              <select
                required
                value={classId}
                onChange={(ev) => setClassId(ev.target.value)}
              >
                <option value="">— Chọn —</option>
                {classes.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              GV dạy (tuỳ chọn)
              <select
                value={teacherId}
                onChange={(ev) => setTeacherId(ev.target.value)}
              >
                <option value="">— Chưa gán —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.id} — {t.full_name ?? t.username ?? ""}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang gửi…" : "Tạo"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Phân công hiện có</h2>
        {loading ? (
          <p className="subtle">Đang tải danh mục…</p>
        ) : loadingRows ? (
          <p className="subtle">Đang tải phân công…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Môn</th>
                  <th>Lớp</th>
                  <th>GV dạy</th>
                  <th>Đổi GV</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      {r.subject_name ?? subjectLabel(r.subject_id)} (
                      {r.subject_id})
                    </td>
                    <td>
                      {r.class_name ?? classLabel(r.class_id)} ({r.class_id})
                    </td>
                    <td>
                      {r.teacher_name ??
                        (r.teacher_id != null
                          ? `#${r.teacher_id}`
                          : "—")}
                    </td>
                    <td>
                      <div className="stack">
                        <select
                          value={teacherPick[r.id] ?? ""}
                          onChange={(ev) =>
                            setTeacherPick((prev) => ({
                              ...prev,
                              [r.id]: ev.target.value,
                            }))
                          }
                        >
                          <option value="">— Không —</option>
                          {teachers.map((t) => (
                            <option key={t.id} value={String(t.id)}>
                              {t.id} — {t.full_name ?? t.username ?? ""}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => void saveTeacher(r.id)}
                        >
                          Lưu
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="subtle">Chưa có phân công nào.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
