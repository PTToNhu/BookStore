# 1. Các chức năng chính của chương trình
## 1.1. Chung
### Đăng nhập
Tên đăng nhập: user00001
Mật khẩu: V2oULkB7OD
Vai trò: Người dùng
## 1.2. Dành cho khách hàng
### Trang chủ
Trang chủ có các chức năng: 
1. Hiển thị danh sách sản phẩm (**Query with a join and aggregate function**)

   Trang chủ hiển thị các thông tin cơ bản của mỗi quyển sách bao gồm giá sách, tên bìa sách, tập (nếu có), và đánh giá của khách hàng (thể hiện qua số sao).

   Trang chủ được phân trang với 12 quyển sách trên mỗi trang, sách sẽ được tự động load thêm mỗi khi người dùng kéo đến cuối trang để tăng hiệu suất cho trang web.

   Thao tác với database:
  
    - Join các bảng book, is_written để lấy các thông tin BookID, tác giả và thể loại sách.
    
    - Tiếp tục join với bảng rating và sử dụng hàm avg để tính trung bình sao được đánh giá cho mỗi quyển sách.
    
    - Join với bảng edition và issue để lấy ra giá sách, sắp xếp các bảng này theo thứ tự tăng dần ngày xuất bản. Dựa trên thể loại sách, nếu sách là Sách tham khảo hoặc tiểu thuyết thì lấy phần tử cuối cùng từ kết quả sau khi join với edition (bản xuất bản cuối cùng), ngược lại lấy từ kết quả join với issue.
   
    - Tương tự, nếu thể loại là sách tham khảo hoặc tiểu thuyết thì trường tập được gán bằng null, ngược lại, trường tập được gán bằng trường volumn của kết quả join với bảng issue.
    
    Kết quả:
  
    - Nếu không dữ liệu (số lượng sách = 0) thì trả về message "Không tìm thấy sách phù hợp."
    
    - Ngược lại, trả về message: "Tìm thấy sách phù hợp" cùng các trường books (lưu trữ danh sách các quyển sách), và hasMore (true: sách vẫn chưa được load hết, người dùng có thể tiếp tục load, false: sách đã được load hết, thông báo "Không còn sách để tải thêm")

    - Nếu quá trình lấy dữ liệu từ database xảy ra lỗi thì trả ra lỗi tương ứng(status 500)
2. Lọc sách theo danh mục sản phẩm, tác giả viết sách và giá (**Query with a composite condition**)
   
   Danh sách sách sẽ được reload mỗi khi có sự thay đổi về danh mục, tác giả, giá được chọn
   
   Thao tác với database: phát triển từ api phía trên, bổ sung thêm 2 trường earlyMatch và lateMatch, trong đó earlyMatch là điều kiện để lọc sách sách với ID tác giả và thể loại sách tương ứng trong quá trình tương tác với database, được match sau khi thực hiện join bảng is_written để giảm số lượng record trước khi join với các bảng khác, lateMatch là điều kiện dùng để lọc các sách nằm trong khoảng giá tương ứng sau khi đã join xong các bảng còn lại.
   
3. Tìm kiếm sách theo tiêu đề (**Query with a single condition có thể chuyển thành subquery**)

   Lấy ra thông tin các quyển sách với điều kiện là chuỗi tìm kiếm là chuỗi con của tiêu đề sách (không phân biệt chữ hoa/thường). Dựa trên BookType để quyết định fetch edition hay issue (tương tự như 2 chức năng trên).

   Kết quả:
    - Nếu số lượng sách tìm được = 0 thì trả về status Not found (404), giao diện hiển thị thông báo lỗi ("Không tìm thấy sách phù hợp và quay về trang chủ). Ngược lại, hiển thị danh sách sản phẩm ra màn hình

    - Nếu quá trình lấy dữ liệu từ database xảy ra lỗi thì trả ra lỗi tương ứng(status 500)
      
4. Xem thông tin chi tiết của một quyển sách
5. Xem giỏ hàng
### Trang hiển thị thông tin chi tiết của sách

Cách truy vấn dữ liệu tương tự như chức năng 1. Hiển thị danh sách sản phẩm trong trang trang chủ, bổ sung thêm điều kiện BookID = giá trị bookid nhập vào, lấy thêm trường description trong bảng book, join với bảng author để lấy thêm thông tin tên tác giả.

Ở trang này, người dùng có thể tăng/giảm hoặc nhập số lượng sách muốn thêm vào giỏ hàng tùy theo mong muốn, đảm bảo yêu cầu số lượng tối thiểu là 1 và tối đa là số lượng tồn kho trong kho.

Dựa trên thông tin khách hàng đang đăng nhập, sách khách hàng muốn thêm vào giỏ hàng, số lượng sách muốn thêm, ta thực hiện truy vấn xem sách đã được khách hàng thêm vào giỏ hàng trước đó chưa thông qua hàm findOne() với điều kiện trên trường CustomerID và BookID tương ứng.

Nếu sách đã được thêm rồi thì thực hiện cập nhật số lượng sách trong cơ sở dữ liệu tăng thêm 1 lượng bằng với số lượng mà khách hàng muốn thêm. (**UPDATE**)

Ngược lại, thực hiện tạo mới 1 record với số lượng quyển sách bằng số lượng mà khách hàng muốn thêm (**INSERT**)
### Trang giỏ hàng
Trang giỏ hàng có các chức năng:
1. Cập nhập số lượng sách theo nhu cầu người dùng (chức năng tương tự như chức năng thêm vào giỏ hàng bên trang hiển thị thông tin sách)
2. Xóa sản phẩm ra khỏi giỏi hàng nếu không còn nhu cầu (**DELETE**)
   Gọi hàm deleteOne trên bảng cart cới điều kiện customerID và BookID
