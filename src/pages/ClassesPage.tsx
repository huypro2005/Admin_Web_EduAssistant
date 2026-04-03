import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as classesApi from "../api/classes";
import * as teachersApi from "../api/teachers";
import type { ClassOut, TeacherOut } from "../types/admin";
import { ErrorBanner } from "../components/ErrorBanner";

export function ClassesPage() {
  const [rows, setRows] = useState<ClassOut[]>([]);
  const [teachers, setTeachers] = useState<TeacherOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [name, setName] = useState("");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [homeroomForClass, setHomeroomForClass] = useState<
    Record<number, string>
  >({});

  const load = useCallback(async () => {
    setError(null);
    try {
      const [c, t] = await Promise.all([
        classesApi.listClasses(),
        teachersApi.listTeachers(),
      ]);
      setRows(c);
      setTeachers(t);
      const next: Record<number, string> = {};
      for (const cl of c) {
        next[cl.id] =
          cl.homeroom_teacher_id != null
            ? String(cl.homeroom_teacher_id)
            : "";
      }
      setHomeroomForClass(next);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const hid = homeroomTeacherId.trim();
      await classesApi.createClass({
        name: name.trim(),
        homeroom_teacher_id:
          hid === "" ? null : Number.parseInt(hid, 10),
      });
      setName("");
      setHomeroomTeacherId("");
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveHomeroom(classId: number) {
    setError(null);
    const raw = homeroomForClass[classId] ?? "";
    const hid = raw.trim();
    try {
      await classesApi.updateClassHomeroom(classId, {
        homeroom_teacher_id:
          hid === "" ? null : Number.parseInt(hid, 10),
      });
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      <h1>Lớp & giáo viên chủ nhiệm</h1>
      <p className="subtle">
        Tạo lớp, gán GVCN: <code>POST/GET /admin/classes</code>,{" "}
        <code>PUT /admin/classes/{"{id}"}/homeroom</code>. Xem học sinh: link
        bên dưới.
      </p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="card">
        <h2>Tạo lớp</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <label>
              Tên lớp *
              <input
                required
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="10A1"
              />
            </label>
            <label>
              GVCN (users.id, tuỳ chọn)
              <select
                value={homeroomTeacherId}
                onChange={(ev) => setHomeroomTeacherId(ev.target.value)}
              >
                <option value="">— Chưa chọn —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.id} — {t.full_name ?? t.username ?? "GV"}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang gửi…" : "Tạo lớp"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Danh sách lớp</h2>
        {loading ? (
          <p className="subtle">Đang tải…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Tên</th>
                  <th>Sĩ số</th>
                  <th>GVCN hiện tại</th>
                  <th>Đổi GVCN</th>
                  <th>Học sinh</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.total_students}</td>
                    <td>
                      {r.homeroom_teacher_name ??
                        (r.homeroom_teacher_id != null
                          ? `#${r.homeroom_teacher_id}`
                          : "—")}
                    </td>
                    <td>
                      <div className="stack">
                        <select
                          value={homeroomForClass[r.id] ?? ""}
                          onChange={(ev) =>
                            setHomeroomForClass((prev) => ({
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
                          onClick={() => void saveHomeroom(r.id)}
                        >
                          Lưu GVCN
                        </button>
                      </div>
                    </td>
                    <td>
                      <Link to={`/classes/${r.id}/students`}>
                        Xem học sinh
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="subtle">Chưa có lớp nào.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
