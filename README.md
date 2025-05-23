# Dự Án BookStore

Chào mừng bạn đến với dự án **BookStore**! Đây là một ứng dụng web để quản lý cửa hàng sách, cho phép khách hàng duyệt, tìm kiếm và mua sách, đồng thời hỗ trợ nhân viên quản lý sách, ấn bản, số phát hành và đơn hàng của khách.

## Công nghệ

Cài đặt các thành phần sau:

- **Node.js**
- **MongoDB**

## Cài Đặt

1. Tải mã nguồn dự án về máy:
   ```bash
   git clone <đường-dẫn-repository>
   cd BookStore
   ```
2. Mở terminal thư mục `server` và cài đặt các gói phụ thuộc:
   ```bash
   cd server
   npm install
   ```
3. Mở terminal thư mục `client` và cài đặt các gói phụ thuộc:
   ```bash
   cd ../client
   npm install
   ```

## Khởi Chạy Ứng Dụng

1. **Khởi động server**:
   - Vào thư mục `server`:
     ```bash
     cd server
     ```
   - Chạy server:
     ```bash
     npm start
     ```
   - Serverchạy trên `http://localhost:5000`
2. **Khởi động client**:
   - Mở một terminal mới và vào thư mục `client`:
     ```bash
     cd client
     ```
   - Chạy client:
     ```bash
     npm start
     ```
   - Client sẽ chạy trên `http://localhost:3000`
3. **Truy cập ứng dụng**:
   - Khi khởi động, ứng dụng sẽ hiển thị **Trang Đăng Nhập**.
   - Người dùng có thể đăng nhập với vai trò **Khách Hàng** hoặc **Nhân Viên** bằng thông tin đăng nhập của mình.

## Thiết Lập Cơ Sở Dữ Liệu

Ứng dụng sử dụng **MongoDB** làm cơ sở dữ liệu. Hãy đảm bảo MongoDB đang chạy và được cấu hình đúng.

1. **Kết nối MongoDB**:
   - Cập nhật chuỗi kết nối MongoDB trong file `server/.env` (hoặc file cấu hình tương ứng):
     ```env
     MONGODB_URI=mongodb://localhost:27017/bookstore
     ```
     Thay thế bằng URI MongoDB của bạn (cục bộ hoặc đám mây, ví dụ: MongoDB Atlas).

## Chức Năng Cho Khách Hàng

Sau khi đăng nhập với vai trò **Khách Hàng**, các chức năng sau sẽ có sẵn:

### 1. Danh Sách Sách

- **Mô tả**: Hiển thị danh sách tất cả các sách hiện có.

### 2. Tìm Kiếm và Lọc Sách

- **Tìm kiếm sách**:

  - Sử dụng điều kiện composite để tìm kiếm theo tựa đề, tác giả hoặc từ khóa.

- **Lọc sách**:
  - Lọc theo **Thể loại**, **Tác giả**, hoặc **Giá**.

### 3. Chi Tiết Sách

- **Mô tả**: Nhấn vào một sách để xem chi tiết (tựa đề, tác giả, thể loại, giá, mô tả, v.v.).
- **Hành động**:
  - **Thêm vào giỏ hàng**: Thêm sách vào giỏ hàng của người dùng.
  - **Mua ngay**: Tạo đơn hàng để mua ngay lập tức.

### 4. Quản Lý Giỏ Hàng

- **Mô tả**: Nút giỏ hàng ở góc trên cho phép người dùng xem và quản lý giỏ hàng.

## Chức Năng Cho Nhân Viên

Sau khi đăng nhập với vai trò **Nhân Viên**, các chức năng sau sẽ có sẵn:

### 1. Danh Sách Sách và Tìm Kiếm

- **Mô tả**: Hiển thị danh sách tất cả sách, hỗ trợ tìm kiếm.

### 2. Thêm Sách Mới

- **Mô tả**: Nhân viên có thể thêm sách mới, bao gồm các ấn bản hoặc số phát hành tương ứng.

### 3. Chi Tiết Sách và Quản Lý

- **Mô tả**: Nhấn vào một sách để xem chi tiết, với tùy chọn thêm/sửa ấn bản hoặc số phát hành.

### 4. Quản Lý Đơn Hàng

- **Mô tả**: Nhân viên có thể xem và quản lý đơn hàng của khách, tìm kiếm theo mã đơn, trạng thái, tên khách hàng hoặc địa chỉ, và cập nhật trạng thái đơn hàng.

### 5. Đơn Hàng Chưa Được Phân Công

- **Mô tả**: Hiển thị các đơn hàng chưa có nhân viên quản lý. Nhân viên có thể nhận xử lý đơn hàng.
