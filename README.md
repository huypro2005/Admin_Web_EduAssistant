# WebCuaMe Admin Frontend

Ứng dụng web quản trị cho hệ thống WebCuaMe, xây dựng bằng React + Vite + TypeScript.  
Frontend gọi backend FastAPI qua nhóm API `/admin/*` và hỗ trợ đầy đủ xác thực JWT (đăng nhập, tự làm mới token, tự đăng xuất khi refresh token hết hạn).

---

## 1) Tính năng chính

### Quản trị nghiệp vụ theo trang

- `Whitelist Telegram`: thêm/xóa Telegram ID giáo viên trước khi dùng bot.
- `Môn học`: tạo, sửa danh mục môn.
- `Lớp & GVCN`: tạo lớp, gán/đổi giáo viên chủ nhiệm.
- `Danh sách GV`: tra cứu giáo viên đã có trong hệ thống.
- `Môn–lớp–GV`: tạo và cập nhật phân công giảng dạy.
- `Học sinh theo lớp`: xem danh sách học sinh của từng lớp.

### Xác thực và an toàn phiên làm việc

- Trang `Đăng nhập` (`/login`) dùng `POST /admin/login`.
- Mọi API bảo vệ tự đính kèm `Authorization: Bearer <access_token>`.
- Khi `access_token` hết hạn, frontend tự gọi `POST /admin/refresh` để lấy cặp token mới.
- Chỉ khi `refresh_token` hết hạn/không hợp lệ mới tự logout và chuyển về `/login`.

---

## 2) Công nghệ sử dụng

- React 18
- React Router DOM 6
- Vite 8
- TypeScript 5

---

## 3) Yêu cầu môi trường

- Node.js 18+ (khuyến nghị bản LTS mới)
- npm 9+
- Backend FastAPI đang chạy và truy cập được từ frontend

---

## 4) Cài đặt và chạy dự án

### Bước 1: Cài dependencies

```bash
npm install
```

### Bước 2: Cấu hình biến môi trường

Copy file mẫu:

```bash
cp .env.example .env
```

Thiết lập:

```env
VITE_API_BASE=http://127.0.0.1:8000
```

Lưu ý:

- Không thêm dấu `/` ở cuối URL.
- URL phải trỏ đúng backend FastAPI của bạn.

### Bước 3: Chạy môi trường dev

```bash
npm run dev
```

Mặc định chạy ở cổng `5173`. Có thể đổi:

```bash
npm run dev -- --port 3000
```

### Bước 4: Build production

```bash
npm run build
npm run preview
```

---

## 5) CORS và kết nối backend

Backend cần cho phép origin của frontend, ví dụ:

- `http://localhost:5173`
- `http://localhost:3000`

Nếu deploy production, cần bổ sung origin production ở cấu hình CORS phía backend.

---

## 6) Tài liệu API và nghiệp vụ

- `ADMIN_API.md`: tài liệu API quản trị theo nghiệp vụ (môn, lớp, giáo viên, phân công...).
- `AUTH_API.md`: tài liệu xác thực (login, refresh, register, thời hạn token).
- `USER_GUIDE_WEB_ADMIN.md`: hướng dẫn sử dụng cho người không biết lập trình.
- `ADMIN_PAGES_PRESENTATION_DOC.md`: tài liệu mô tả trang và công dụng phục vụ thuyết trình.

OpenAPI backend (khi server chạy):

- `GET {VITE_API_BASE}/docs`
- `GET {VITE_API_BASE}/redoc`

---

## 7) Luồng sử dụng gợi ý cho người quản trị

1. Đăng nhập tại `/login`.
2. Vào `Whitelist Telegram` để thêm Telegram ID giáo viên.
3. Tạo `Môn học`.
4. Tạo `Lớp & GVCN`.
5. Kiểm tra `Danh sách GV`.
6. Phân công tại `Môn–lớp–GV`.
7. Kiểm tra `Học sinh theo lớp` khi cần đối soát.

---

## 8) Cấu trúc mã nguồn chính

| Đường dẫn | Vai trò |
|---|---|
| `src/App.tsx` | Router chính của ứng dụng, bao gồm route bảo vệ đăng nhập |
| `src/components/Layout.tsx` | Khung giao diện + menu điều hướng + đăng xuất |
| `src/components/RequireAuth.tsx` | Chặn truy cập trang admin khi chưa có phiên đăng nhập |
| `src/pages/LoginPage.tsx` | Màn hình đăng nhập admin |
| `src/pages/*` | Các trang nghiệp vụ quản trị |
| `src/api/client.ts` | HTTP client chung: base URL, parse lỗi, gắn token, auto refresh |
| `src/api/auth.ts` | Gọi API login/logout |
| `src/api/teleTeachers.ts` | API whitelist Telegram |
| `src/api/teachers.ts` | API danh sách giáo viên |
| `src/api/subjects.ts` | API môn học |
| `src/api/classes.ts` | API lớp, GVCN, học sinh theo lớp |
| `src/api/subjectClasses.ts` | API phân công môn–lớp–GV |
| `src/auth/tokens.ts` | Lưu/xóa/đọc access token và refresh token |
| `src/types/admin.ts` | TypeScript interfaces cho dữ liệu admin |

---

## 9) Quy ước xử lý lỗi

- Backend trả lỗi chuẩn qua `detail`; frontend parse và hiển thị qua `ErrorBanner`.
- Các mã thường gặp:
  - `401`: chưa xác thực / token hết hạn / token không hợp lệ.
  - `404`: không tìm thấy dữ liệu.
  - `409`: xung đột dữ liệu (trùng tên, trùng khóa nghiệp vụ...).

---

## 10) Gợi ý mở rộng

- Bổ sung trang quản lý tài khoản admin (đổi mật khẩu, khóa/mở tài khoản).
- Chuyển lưu token sang `httpOnly cookie` nếu backend hỗ trợ.
- Thêm test E2E cho luồng đăng nhập và auto-refresh token.
- Thêm phân trang/tìm kiếm cho các bảng dữ liệu lớn.
