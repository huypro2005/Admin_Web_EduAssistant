# Hướng dẫn sử dụng WebCuaMe Admin (dành cho người không biết lập trình)

Tài liệu này chỉ tập trung vào **tính năng** và **cách dùng**. Bạn không cần biết lập trình.

## Web này dùng để làm gì?

Web giúp bạn quản trị dữ liệu để hệ thống hoạt động đúng, gồm:

1. Cho phép (whitelist) **Telegram của giáo viên** để họ có thể tương tác với bot.
2. Tạo và chỉnh **môn học**.
3. Tạo **lớp** và gán **giáo viên chủ nhiệm (GVCN)**.
4. Ghép **môn – lớp – giáo viên dạy** theo từng phân công.
5. Xem danh sách **học sinh theo từng lớp**.

## Bắt đầu nhanh

Ở bên trái có thanh menu theo thứ tự:

1. `Whitelist Telegram`
2. `Môn học`
3. `Lớp & GVCN`
4. `Danh sách GV`
5. `Môn–lớp–GV`

Chọn mục nào thì nội dung ở giữa sẽ thay đổi theo mục đó.

## 1) Whitelist Telegram (giáo viên)

### Làm gì?

Mục này để **đăng ký Telegram ID** của giáo viên trước khi giáo viên bấm `/start` với bot.

### Cách dùng

1. Ở ô `telegram_id`, nhập ID Telegram của giáo viên (bắt buộc).
2. Ô `username` là tùy chọn (có thì nhập, không có thì để trống).
3. Nhấn `Thêm`.
4. Nếu nhập sai, dùng nút `Xóa` ở hàng tương ứng.

## 2) Môn học

### Làm gì?

Tạo danh sách các môn (ví dụ: Toán, Văn, Anh…).

### Cách dùng

#### Thêm môn

1. Nhập `Tên môn` (bắt buộc).
2. Nhập `Mô tả` (tùy chọn).
3. Nhấn `Thêm`.

#### Sửa môn

1. Ở dòng môn, bấm `Sửa`.
2. Chỉnh `Tên` và/hoặc `Mô tả`.
3. Bấm `Lưu` để cập nhật, hoặc `Huỷ` để bỏ thay đổi.

## 3) Lớp & GVCN

### Làm gì?

Tạo lớp học và gán/đổi giáo viên chủ nhiệm (GVCN). Đồng thời bạn có thể xem học sinh theo từng lớp.

### Cách dùng

#### Tạo lớp

1. Nhập `Tên lớp` (bắt buộc, ví dụ `10A1`).
2. `GVCN` (tùy chọn): chọn một giáo viên từ danh sách. Nếu không chọn thì hệ thống để trống.
3. Nhấn `Tạo lớp`.

#### Đổi GVCN

1. Ở dòng của lớp, chọn lại GVCN trong ô chọn.
2. Bấm `Lưu GVCN`.

#### Xem học sinh

1. Bấm `Xem học sinh` dưới cột tương ứng của lớp.
2. Xem danh sách học sinh của lớp đó.
3. Bấm `← Quay lại lớp` để quay về trang danh sách lớp.

## 4) Danh sách GV

### Làm gì?

Trang này để **xem** thông tin giáo viên đã được hệ thống ghi nhận sau khi họ tương tác với bot.

### Bạn sẽ thấy gì?

- `id`: mã nội bộ của giáo viên
- `telegram_id`, `username` (nếu có)
- `Họ tên` (nếu hệ thống có lấy được)
- `active` (có/không)
- `Lớp chủ nhiệm` (các lớp mà giáo viên đang là GVCN)

Trang này hiện tại **không có nút thêm/sửa**, chủ yếu để xem.

## 5) Môn–lớp–GV dạy

### Làm gì?

Trang này dùng để:

- ghép một **môn** vào một **lớp**
- gán **giáo viên dạy** cho cặp môn–lớp (có thể để trống nếu chưa gán)

### Cách dùng

#### Lọc theo lớp (khi dữ liệu nhiều)

Nếu bạn có nhiều lớp, hãy chọn `class_id` trong phần `Lọc danh sách` để xem đúng các phân công liên quan.

#### Thêm phân công

1. Chọn `Môn` (bắt buộc).
2. Chọn `Lớp` (bắt buộc).
3. `GV dạy` (tùy chọn): chọn giáo viên, hoặc để `Chưa gán` nếu chưa biết ai dạy.
4. Nhấn `Tạo`.

#### Đổi giáo viên dạy

Ở bảng bên dưới:

1. Chọn lại `GV dạy` trong danh sách thả xuống.
2. Bấm `Lưu`.

## Khi có lỗi

Nếu có vấn đề (ví dụ dữ liệu không đúng, không tìm thấy, hoặc xung đột), hệ thống sẽ hiện thông báo lỗi màu đỏ ở đầu trang.

Bạn có thể bấm `Đóng` để tắt thông báo và thử lại.

## Gợi ý sử dụng theo thứ tự

1. Làm `Whitelist Telegram` để giáo viên tương tác được với bot.
2. Tạo `Môn học`.
3. Tạo `Lớp & GVCN` (gán GVCN nếu có).
4. Vào `Môn–lớp–GV` để phân công dạy.
5. Xem lại `Học sinh theo lớp` nếu cần kiểm tra dữ liệu.

