import { useCallback, useEffect, useState } from "react";
import * as api from "../api/subjects";
import type { SubjectOut } from "../types/admin";
import { ErrorBanner } from "../components/ErrorBanner";

export function SubjectsPage() {
  const [rows, setRows] = useState<SubjectOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.listSubjects();
      setRows(data);
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
      await api.createSubject({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(s: SubjectOut) {
    setEditingId(s.id);
    setEditName(s.name);
    setEditDescription(s.description ?? "");
  }

  async function saveEdit() {
    if (editingId == null) return;
    setError(null);
    try {
      await api.updateSubject(editingId, {
        name: editName.trim(),
        description: editDescription.trim() || null,
      });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      <h1>Môn học</h1>
      <p className="subtle">
        Quản lý môn: <code>POST/GET /admin/subjects</code>,{" "}
        <code>PUT /admin/subjects/{"{id}"}</code>
      </p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="card">
        <h2>Thêm môn</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <label>
              Tên môn *
              <input
                required
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder="Toán"
              />
            </label>
            <label style={{ minWidth: 280 }}>
              Mô tả
              <input
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
                placeholder="Tuỳ chọn"
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang gửi…" : "Thêm"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Danh sách</h2>
        {loading ? (
          <p className="subtle">Đang tải…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    {editingId === r.id ? (
                      <>
                        <td>
                          <input
                            value={editName}
                            onChange={(ev) => setEditName(ev.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={editDescription}
                            onChange={(ev) =>
                              setEditDescription(ev.target.value)
                            }
                          />
                        </td>
                        <td className="stack">
                          <button type="button" onClick={() => void saveEdit()}>
                            Lưu
                          </button>
                          <button
                            type="button"
                            className="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            Huỷ
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{r.name}</td>
                        <td>{r.description ?? "—"}</td>
                        <td>
                          <button
                            type="button"
                            className="ghost"
                            onClick={() => startEdit(r)}
                          >
                            Sửa
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="subtle">Chưa có môn nào.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
