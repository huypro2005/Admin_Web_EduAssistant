import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearTokens } from "../auth/tokens";

const links = [
  { to: "/tele-teachers", label: "1. Whitelist Telegram" },
  { to: "/subjects", label: "2. Môn học" },
  { to: "/classes", label: "3. Lớp & GVCN" },
  { to: "/teachers", label: "4. Danh sách GV" },
  { to: "/subject-classes", label: "5. Môn–lớp–GV" },
] as const;

export function Layout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearTokens();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-title">WebCuaMe Admin</div>
        <nav>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: "0 1.25rem", marginTop: "0.75rem" }}>
          <button type="button" className="ghost" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
