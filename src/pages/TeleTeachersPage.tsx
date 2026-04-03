import { useCallback, useEffect, useState } from "react";
import * as api from "../api/teleTeachers";
import type { TeleTeacherOut } from "../types/admin";
import { ErrorBanner } from "../components/ErrorBanner";

export function TeleTeachersPage() {
  const [rows, setRows] = useState<TeleTeacherOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [telegramId, setTelegramId] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.listTeleTeachers();
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
      await api.createTeleTeacher({
        telegram_id: telegramId.trim(),
        username: username.trim() || null,
      });
      setTelegramId("");
      setUsername("");
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Xóa bản ghi whitelist này?")) return;
    setError(null);
    try {
      await api.deleteTeleTeacher(id);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      <h1>Whitelist Telegram (giáo viên)</h1>
      <p className="subtle">
        Thêm Telegram ID trước khi giáo viên <code>/start</code> bot.{" "}
        <code>POST/GET/DELETE /admin/tele-teachers</code>
      </p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="card">
        <h2>Thêm mới</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <label>
              telegram_id *
              <input
                required
                value={telegramId}
                onChange={(ev) => setTelegramId(ev.target.value)}
                placeholder="123456789"
              />
            </label>
            <label>
              username (tuỳ chọn)
              <input
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                placeholder="optional_username"
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
                  <th>telegram_id</th>
                  <th>username</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.telegram_id}</td>
                    <td>{r.username ?? "—"}</td>
                    <td>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => void handleDelete(r.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="subtle">Chưa có bản ghi nào.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
