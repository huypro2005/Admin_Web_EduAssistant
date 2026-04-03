import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBanner } from "../components/ErrorBanner";
import * as authApi from "../api/auth";
import { hasRefreshToken } from "../auth/tokens";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (hasRefreshToken()) {
      navigate("/tele-teachers", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await authApi.login(username.trim(), password);
      navigate("/tele-teachers", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1>Đăng nhập admin</h1>
      <p className="subtle">
        Để truy cập các trang quản trị, bạn cần đăng nhập bằng tài khoản
        admin.
      </p>

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="card">
        <h2>Thông tin đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              username *
              <input
                required
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                placeholder="admin"
              />
            </label>
            <label style={{ minWidth: 280 }}>
              password *
              <input
                required
                type="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                placeholder="••••••••"
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

