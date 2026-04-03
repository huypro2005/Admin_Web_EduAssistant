import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as classesApi from "../api/classes";
import type { StudentOut } from "../types/admin";
import { ErrorBanner } from "../components/ErrorBanner";

export function ClassStudentsPage() {
  const { classId } = useParams<{ classId: string }>();
  const id = classId != null ? Number.parseInt(classId, 10) : NaN;
  const [rows, setRows] = useState<StudentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    if (Number.isNaN(id)) {
      setError(new Error("class_id không hợp lệ"));
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const data = await classesApi.listClassStudents(id);
      setRows(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <p>
        <Link to="/classes">← Quay lại lớp</Link>
      </p>
      <h1>Học sinh lớp #{classId}</h1>
      <p className="subtle">
        <code>GET /admin/classes/{"{class_id}"}/students</code>
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
                  <th>Họ tên / username</th>
                  <th>Chi tiết (JSON)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>
                      {String(r.full_name ?? r.username ?? "—")}
                    </td>
                    <td>
                      <code
                        style={{
                          fontSize: "0.75rem",
                          wordBreak: "break-all",
                        }}
                      >
                        {JSON.stringify(r)}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && !error && (
              <p className="subtle">Không có học sinh hoặc lớp trống.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
