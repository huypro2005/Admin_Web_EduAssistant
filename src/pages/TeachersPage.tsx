import { useCallback, useEffect, useState } from "react";
import * as api from "../api/teachers";
import type { TeacherOut } from "../types/admin";
import { ErrorBanner } from "../components/ErrorBanner";

export function TeachersPage() {
  const [rows, setRows] = useState<TeacherOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.listTeachers();
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

  return (
    <>
      <h1>Giáo viên</h1>
      <p className="subtle">
        Danh sách sau khi GV đã tương tác bot. Dùng <code>id</code> cho GVCN
        và giáo viên dạy môn. <code>GET /admin/teachers</code>
      </p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

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
                  <th>Họ tên</th>
                  <th>active</th>
                  <th>Lớp chủ nhiệm</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.telegram_id ?? "—"}</td>
                    <td>{r.username ?? "—"}</td>
                    <td>{r.full_name ?? "—"}</td>
                    <td>{r.is_active ? "có" : "không"}</td>
                    <td>
                      {r.homeroom_classes.length === 0
                        ? "—"
                        : r.homeroom_classes.map((c) => c.name).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="subtle">Chưa có giáo viên nào trong hệ thống.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
