# Bé Làm Toán

[English](README.en.md)

Ứng dụng luyện phép cộng và phép trừ dành cho trẻ em, được xây dựng bằng Blazor và .NET 10.

## Tính năng

- Tạo câu hỏi cộng, trừ với giới hạn kết quả có thể điều chỉnh.
- Kiểm tra câu trả lời và phát âm thanh phản hồi.
- Theo dõi số câu trả lời đúng trong phiên hiện tại.
- Lưu lịch sử làm bài theo ngày, gồm phép tính, giờ làm, câu trả lời và đáp án đúng nếu trả lời sai.
- Tổng kết mỗi ngày với số câu đúng, số câu sai và số sao tương ứng với số câu đúng.

Lịch sử được lưu trong `localStorage` của trình duyệt. Dữ liệu chỉ có trên trình duyệt và thiết bị đang sử dụng; xóa dữ liệu trang web trong trình duyệt sẽ xóa lịch sử.

## Yêu cầu

- .NET SDK 10.0

## Chạy ứng dụng

Tại thư mục dự án, chạy:

```bash
dotnet run
```

Trong Development, ứng dụng có thể truy cập tại:

- HTTP: <http://localhost:5127>
- HTTPS: <https://localhost:7166>

## Build

```bash
dotnet build
```
