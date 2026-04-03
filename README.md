# WebCuaMe — Admin frontend

Ứng dụng web quản trị (React + Vite + TypeScript) gọi API FastAPI theo `ADMIN_API.md` (prefix `/admin`).

## Cài đặt

```bash
npm install
```

## Cấu hình API

1. Copy `.env.example` thành `.env` trong thư mục project.
2. Đặt `VITE_API_BASE` trỏ tới backend (không có dấu `/` cuối), ví dụ:

   `VITE_API_BASE=http://127.0.0.1:8000`

Toàn bộ request dùng một hàm `getApiBase()` trong `src/api/client.ts` — không cần lặp URL ở từng file API.

## Chạy dev

```bash
npm run dev
```

Mặc định Vite mở cổng **5173** (xem `vite.config.ts`). Có thể đổi port bằng `npm run dev -- --port 3000`.

## Build production

```bash
npm run build
npm run preview
```

## CORS

Backend cần cho phép origin của frontend, ví dụ:

- `http://localhost:5173`
- `http://localhost:3000`

Theo `ADMIN_API.md`, server đã cấu hình các origin dev phổ biến; khi deploy production, thêm origin thật vào CORS phía FastAPI.

## Cấu trúc gợi ý

| Thư mục / file | Nội dung |
|----------------|----------|
| `src/api/client.ts` | Base URL, `fetch` wrapper, `ApiError`, parse `detail` từ FastAPI |
| `src/api/teleTeachers.ts` | Whitelist Telegram |
| `src/api/teachers.ts` | Danh sách GV |
| `src/api/subjects.ts` | Môn học |
| `src/api/classes.ts` | Lớp, GVCN, học sinh theo lớp |
| `src/api/subjectClasses.ts` | Phân công môn–lớp–GV |
| `src/types/admin.ts` | Kiểu TypeScript khớp tài liệu API |
| `src/pages/*` | Màn hình theo flow gợi ý trong doc |

OpenAPI đầy đủ: `GET {VITE_API_BASE}/docs` khi server chạy.
