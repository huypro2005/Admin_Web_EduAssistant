# Tài liệu thuyết trình: Các trang Web Admin và công dụng

## 1) Bối cảnh và mục tiêu của Web Admin

Web Admin là công cụ quản trị tập trung cho hệ thống WebCuaMe, giúp nhà trường và tổ chuyên môn:

- Chuẩn hóa dữ liệu đầu vào (giáo viên, lớp, môn, phân công dạy học).
- Giảm thao tác thủ công và giảm sai sót khi vận hành bot/hệ thống.
- Theo dõi dữ liệu theo luồng nghiệp vụ thực tế của nhà trường.
- Đảm bảo người quản trị có thể xử lý nhanh, ngay cả khi không có kiến thức kỹ thuật.

Nói ngắn gọn, Web Admin là “bảng điều khiển vận hành” để biến dữ liệu rời rạc thành dữ liệu đồng bộ, phục vụ quản lý và dạy học.

---

## 2) Đối tượng sử dụng

- Ban giám hiệu, tổ trưởng chuyên môn, cán bộ phụ trách CNTT trường.
- Người dùng nghiệp vụ cần thao tác quản trị dữ liệu nhưng không lập trình.

Yêu cầu kỹ năng: chỉ cần biết quy trình quản lý của trường, không cần biết code.

---

## 3) Cấu trúc điều hướng tổng thể

Thanh menu bên trái gồm 5 trang chính:

1. `Whitelist Telegram`
2. `Môn học`
3. `Lớp & GVCN`
4. `Danh sách GV`
5. `Môn–lớp–GV`

Ngoài ra có trang phụ:

- `Học sinh theo lớp` (mở từ trang `Lớp & GVCN`)

Luồng sử dụng khuyến nghị:

`Whitelist Telegram` -> `Môn học` -> `Lớp & GVCN` -> `Danh sách GV` -> `Môn–lớp–GV` -> `Học sinh theo lớp`

---

## 4) Mô tả chi tiết từng trang

## Trang 1: Whitelist Telegram

### Mục đích

Cho phép trước tài khoản Telegram của giáo viên để hệ thống bot chỉ nhận người dùng hợp lệ.

### Công dụng nghiệp vụ

- Kiểm soát đầu vào người dùng giáo viên.
- Tránh trường hợp người lạ truy cập bot giáo vụ.
- Tạo bước nền bắt buộc trước khi giáo viên bắt đầu sử dụng hệ thống.

### Dữ liệu quản lý

- `telegram_id` (bắt buộc)
- `username` (tùy chọn)

### Chức năng thao tác

- Thêm mới whitelist.
- Xem danh sách whitelist đã có.
- Xóa whitelist khi nhập sai hoặc giáo viên không còn sử dụng.

### Giá trị thực tế

- Tăng an toàn vận hành.
- Giảm lỗi “đúng người, sai tài khoản”.
- Hỗ trợ truy vết khi có sự cố xác thực.

---

## Trang 2: Môn học

### Mục đích

Quản lý danh mục môn học làm chuẩn chung cho toàn bộ nghiệp vụ phân công.

### Công dụng nghiệp vụ

- Tạo danh sách môn chính xác, nhất quán.
- Hạn chế nhập tự do gây trùng tên/khác cách viết.
- Là nguồn dữ liệu chuẩn cho trang `Môn–lớp–GV`.

### Dữ liệu quản lý

- `Tên môn` (bắt buộc)
- `Mô tả` (tùy chọn, dùng để ghi chú đặc thù môn)

### Chức năng thao tác

- Thêm môn mới.
- Chỉnh sửa tên/mô tả môn.
- Xem toàn bộ danh sách môn hiện có.

### Giá trị thực tế

- Chuẩn hóa danh mục chuyên môn.
- Giảm sai sót khi phân công giáo viên.
- Tạo nền tảng báo cáo theo môn.

---

## Trang 3: Lớp & GVCN

### Mục đích

Quản lý lớp học và gán giáo viên chủ nhiệm (GVCN) theo từng lớp.

### Công dụng nghiệp vụ

- Thiết lập cấu trúc tổ chức lớp.
- Phân quyền trách nhiệm chủ nhiệm rõ ràng theo từng lớp.
- Từ mỗi lớp có thể đi sâu vào danh sách học sinh.

### Dữ liệu quản lý

- `Tên lớp` (bắt buộc)
- `GVCN` (tùy chọn khi tạo, có thể cập nhật sau)

### Chức năng thao tác

- Tạo lớp mới.
- Chọn/đổi GVCN cho lớp.
- Xem sĩ số lớp.
- Mở trang `Học sinh theo lớp`.

### Giá trị thực tế

- Đồng bộ dữ liệu quản trị lớp.
- Tăng tính minh bạch trách nhiệm chủ nhiệm.
- Hỗ trợ kiểm tra nhanh dữ liệu học sinh theo từng đơn vị lớp.

---

## Trang 4: Danh sách GV

### Mục đích

Hiển thị danh sách giáo viên đã được hệ thống ghi nhận để phục vụ chọn dữ liệu ở các trang khác.

### Công dụng nghiệp vụ

- Kiểm tra giáo viên đã có trong hệ thống chưa.
- Lấy đúng `id` giáo viên để gán GVCN và phân công dạy môn.
- Theo dõi trạng thái hoạt động của giáo viên trong hệ thống.

### Dữ liệu hiển thị

- `id` giáo viên
- `telegram_id`, `username`
- `họ tên`
- trạng thái `active`
- danh sách lớp đang chủ nhiệm

### Chức năng thao tác

- Tra cứu danh sách giáo viên theo dữ liệu hiện hành.
- Đối chiếu thông tin trước khi phân công.

### Giá trị thực tế

- Tránh phân công nhầm người.
- Đảm bảo dữ liệu phân công dựa trên danh sách giáo viên hợp lệ.
- Hỗ trợ kiểm kê tình trạng người dùng giáo viên.

---

## Trang 5: Môn–lớp–GV

### Mục đích

Thiết lập phân công giảng dạy: môn nào dạy cho lớp nào và ai là người phụ trách.

### Công dụng nghiệp vụ

- Là trang trọng tâm của quản trị chuyên môn.
- Kết nối 3 thành phần quan trọng: môn học - lớp học - giáo viên.
- Cho phép điều chỉnh linh hoạt khi thay đổi kế hoạch dạy học.

### Dữ liệu quản lý

- `Môn` (bắt buộc)
- `Lớp` (bắt buộc)
- `Giáo viên dạy` (tùy chọn, có thể cập nhật sau)

### Chức năng thao tác

- Lọc phân công theo lớp để thao tác nhanh khi dữ liệu lớn.
- Tạo mới một phân công môn-lớp.
- Cập nhật giáo viên dạy cho phân công đã có.
- Xem bảng tổng hợp toàn bộ phân công hiện hành.

### Giá trị thực tế

- Quản trị phân công tập trung, trực quan.
- Giảm nhầm lẫn do xử lý bảng tính thủ công.
- Hỗ trợ triển khai thời khóa biểu, báo cáo chuyên môn và các tính năng downstream.

---

## Trang phụ: Học sinh theo lớp

### Mục đích

Tra cứu danh sách học sinh theo từng lớp để kiểm tra tính đầy đủ dữ liệu.

### Công dụng nghiệp vụ

- Xác minh lớp đã có dữ liệu học sinh hay chưa.
- Kiểm tra nhanh thông tin cơ bản học sinh.
- Hỗ trợ đối soát sĩ số và chất lượng dữ liệu đầu vào.

### Chức năng thao tác

- Xem danh sách học sinh của lớp được chọn từ trang `Lớp & GVCN`.
- Quay lại trang lớp để thao tác tiếp.

### Giá trị thực tế

- Tăng khả năng giám sát dữ liệu học sinh.
- Giảm thời gian kiểm tra thủ công nhiều nguồn.

---

## 5) Cơ chế đăng nhập và an toàn phiên làm việc

Hệ thống đã bổ sung cơ chế xác thực JWT theo tiêu chuẩn API:

- Mỗi API gọi server đều đính kèm `access_token`.
- Khi `access_token` hết hạn: hệ thống tự dùng `refresh_token` để cấp mới token và tiếp tục làm việc.
- Chỉ khi `refresh_token` hết hạn/không hợp lệ mới buộc đăng nhập lại.

Ý nghĩa trong vận hành:

- Người dùng không bị gián đoạn thao tác thường xuyên.
- Tăng bảo mật hơn so với phiên đăng nhập không kiểm soát hạn dùng.
- Cân bằng tốt giữa tiện dụng và an toàn.

---

## 6) Điểm nổi bật để đưa vào slide “Sáng kiến kinh nghiệm”

## 6.1 Sáng kiến về quy trình

- Chuyển từ quản lý rời rạc sang quy trình chuẩn hóa theo luồng dữ liệu thật.
- Mỗi trang tương ứng một bước nghiệp vụ, giúp người dùng dễ tiếp cận.

## 6.2 Sáng kiến về tổ chức dữ liệu

- Dữ liệu lõi được tách lớp rõ: whitelist -> giáo viên -> lớp -> môn -> phân công.
- Hạn chế nhập liệu trùng/sai nhờ chọn từ danh mục.

## 6.3 Sáng kiến về vận hành

- Giao diện tập trung một nơi, giảm thao tác chuyển công cụ.
- Cập nhật nhanh khi thay đổi nhân sự/phân công.
- Có thông báo lỗi rõ ràng để xử lý kịp thời.

## 6.4 Sáng kiến về bảo mật và ổn định

- Xác thực token có vòng đời, tự gia hạn phiên.
- Chỉ đăng xuất khi phiên làm mới hết hạn, tránh mất thao tác không cần thiết.

---

## 7) Hiệu quả kỳ vọng khi áp dụng

- Giảm thời gian nhập liệu và chỉnh sửa dữ liệu quản trị.
- Giảm lỗi phân công môn/lớp/giáo viên.
- Tăng độ tin cậy dữ liệu dùng cho các hệ thống liên quan.
- Tạo nền tảng cho báo cáo, thống kê và mở rộng số hóa quản trị nhà trường.

---

## 8) Mẫu kịch bản thuyết trình ngắn (gợi ý 3-5 phút)

1. Nêu vấn đề cũ: dữ liệu phân tán, dễ sai, khó kiểm soát.
2. Giới thiệu giải pháp Web Admin theo 5 trang nghiệp vụ.
3. Trình bày nhanh công dụng từng trang theo đúng luồng làm việc.
4. Nhấn mạnh cơ chế đăng nhập an toàn, tự refresh phiên.
5. Kết luận bằng hiệu quả đạt được và khả năng mở rộng.

---

## 9) Câu kết dùng cho slide tổng kết

“Web Admin không chỉ là giao diện nhập liệu, mà là một mô hình tổ chức dữ liệu và quy trình vận hành số hóa cho nhà trường: đúng người - đúng lớp - đúng môn - đúng phân công, an toàn và bền vững.”

