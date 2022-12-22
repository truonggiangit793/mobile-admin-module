# PHÁT TRIỂN ỨNG DỤNG DI ĐỘNG

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)]()

Báo cáo môn học: **Phát triển ứng dụng di động**

Giảng viên hướng dẫn: **Doãn Xuân Thanh**

Báo cáo được thực hiện bởi:

- Phạm Trường Giang - 51900793

## Giới thiệu đề tài

- Tên đề tài: **ỨNG DỤNG REACT NATIVE QUÉT MÃ VẠCH SẢN PHẨM**
- Giới thiệu: Ứng dụng quét mã vạch sản phẩm nhằm quản lý các mặt hàng cận date ở cửa hàng tiện lợi: Hàng tháng ở cửa hàng tiện lợi, cửa hàng trưởng sẽ phân chia nhiệm vụ cho từng nhân viên để kiểm tra hạn sử dụng của tất cả các sản phẩm có trong cửa hàng (từ những sản phẩm được trưng bài ở quầy kệ cho đến tất cả các sản phẩm tồn trong kho). Thay cho việc phải ghi ra giấy số mã vạch của sản phẩm, hạn sử dụng và note lại số lượng cho từng sản phẩm đó. Bằng việc sử dụng ứng dụng này, nhân viên có thể tiết kiệm thời gian hơn trong quá trình làm việc dựa vào tính năng quét mã vạch thông qua camera điện thoại, hệ thống sẽ hiển thị ra thông tin của sản phẩm đó, nhân viên chỉ cần nhập dữ liệu là hạn sử dụng và số lượng mà mình kiểm kê được. Mặt khác, cửa hàng trưởng sẽ rất tốn thời gian trong việc phải nhập tay lại toàn bộ danh sách giấy do nhân viên cung cấp vào file excel để báo cáo cho công ty nếu làm theo cách truyền thống này, do đó sự ra đời của ứng dụng giúp cho cửa hàng trưởng và nhân viên trong cửa hàng tiết kiệm thời gian hơn trong quá trình làm việc, cửa hàng trưởng sẽ không cần phải nhập tay lại toàn bộ danh sách mà chỉ cần truy cập vào hệ thống để tải xuống file excel.

## Những tính năng chính

- Đăng nhập và đăng xuất.
- Xem danh sách công việc.
- Xem chi tiết công việc.
- Quét mã vạch sản phẩm.
- Nhập thông tin cho sản phẩm để thực hiện công việc.
- Theo dõi tiến độ công việc.
- Xem thông tin cá nhân.
- Chỉnh sửa thông tin cá nhân.
- Thay đổi mật khẩu đăng nhập.
- Quản lý danh sách nhân viên, thêm, xoá, sửa nhân viên.
- Quản lý danh sách sản phẩm của cửa hàng, thêm xoá sửa sản phẩm.
- Quản lý danh sách công việc và phân công công việc.
- Xem tiến độ làm việc và xuất báo cáo.
- Đánh dấu công việc đã được hoàn thành.

## Công nghệ sử dụng

Công nghệ sử dụng cho việc xây dụng hệ thống API BACK-END:

- [Node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework

Công nghệ sử dụng xây dựng giao diện người dùng:

- [VueJS] - HTML enhanced for web apps!

Hệ cơ sở dũ liệu : [MongoDB]

## Cài đặt

Yêu cầu tối thiểu [Node.js](https://nodejs.org/) v10+

Tài xuống bằng [git] bằng cách sao chép dòng lệnh dưới đây và chạy trong cmd:

```
git clone https://github.com/truonggiangit793/mobile-admin-module.git
```

Tiến hành cài đặt các gói thư viện cần thiết:

```sh
cd mobile-admin-module
yarn
```

Cấu hình các biến môi trường ở file **.env**:

- **PORT**: chỉ định port mặc định cho việc khởi chạy server.
- **SECRET_KEY**: chìa khoá bảo mật sử dụng cho jwt.
- **ADMIN_PASSWORD**: Mật khẩu mặc định của tài khoản ADMIN.
- **DB_URL**: chỉ định url cho việc kết nối database.
- **VUE_APP_API_URL**: chỉ định địa chỉ API cho việc call API ở phía font-end.

Cài đặt MongoDB, xem thêm cách cài đặt tại đây [MongoDB - Document]

## Khởi chạy hệ thống

Dưới đây là các bước chi tiết khởi chạy hệ thông sau khi hoàn thành các yêu cầu tối thiểu phía trên.

##### 1. Khởi chạy API Server

Để chạy API Server, gõ lệnh sau đây:

```
yarn start
```

Chạy API Server ở môi trường phát triển, gõ lệnh sau đây:

```
yarn dev
```

Khi đó API Server sẽ khởi chạy tại PORT đã được chỉ định.

##### 2. Khởi chạy ứng dụng VUE

Để chạy ứng dụng VUE, gõ lệnh sau đây:

```
yarn serve
```

Truy cập ứng dụng VUE bằng cách click vào đường dẫn được in ra ở màn hình command line.

##### 2. Build ứng dụng Vue

Sau khi hoàn tất việc phát triển, để build ứng dụng VUE bằng cách chạy dòng lệnh sau:

```
yarn build
```

Sau khi hoàn tất quá trình build ứng dụng, các tài nguyên được tạo trong thư mục **/server/client**

## License

MIT

**Thanks!**

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[git]: https://git-scm.com/
[node.js]: http://nodejs.org
[express]: http://expressjs.com
[vuejs]: http://vuejs.org
[mongodb]: https://www.mongodb.com
[mongodb - document]: https://www.mongodb.com/docs/
