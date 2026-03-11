# 📱 Frontend — Ứng dụng Thương Mại Điện Tử

> Giao diện người dùng xây dựng bằng **React 18** + **Redux Toolkit** + **React Bootstrap**, kết nối với Backend REST API qua Axios với cơ chế tự động làm mới JWT token.

---

## 🗂️ Mục lục

- [Tổng quan](#-tổng-quan)
- [Tài khoản thử nghiệm](#-tài-khoản-thử-nghiệm)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [Luồng xác thực (Auth Flow)](#-luồng-xác-thực-auth-flow)
- [Redux Store](#-redux-store)
- [Các trang chính](#-các-trang-chính)

---

## 🧪 Tài khoản thử nghiệm

> Dùng để test nhanh mà không cần đăng ký mới.

| Vai trò | Username | Mật khẩu | Trang đăng nhập |
|---|---|---|---|
| 👤 Khách hàng | `test` | `123Aaa` | `/login` |
| 🛡️ Admin | `admin` | `123Vinh` | `/admin` |
| 👔 Staff (Nhân viên) | `staff` | `123Vinh` | `/admin` |

---

## 🌐 Tổng quan

Ứng dụng bán hàng điện thoại di động với đầy đủ tính năng cho cả khách hàng và quản trị viên:

- Khách hàng: đăng ký, đăng nhập, duyệt sản phẩm, giỏ hàng, thanh toán COD / ZaloPay, quản lý đơn hàng
- Admin: quản lý sản phẩm, danh mục, đơn hàng, vận chuyển, thống kê

---

## ⚙️ Công nghệ sử dụng

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| React | ^18.3.1 | UI framework |
| React Router DOM | ^6.24.0 | Điều hướng trang |
| Redux Toolkit | ^2.2.6 | Quản lý state toàn cục |
| redux-persist | ^6.0.0 | Lưu state vào localStorage |
| Axios | ^1.7.2 | Gọi HTTP API |
| jwt-decode | ^4.0.0 | Giải mã JWT token |
| React Bootstrap | ^2.10.2 | UI components |
| Ant Design (antd) | ^5.17.4 | UI components bổ sung |
| Chart.js | ^4.4.3 | Biểu đồ thống kê (Admin) |
| moment | ^2.30.1 | Xử lý ngày giờ |

---

## 📁 Cấu trúc thư mục

```
src/
├── Common/
│   ├── Header.js          # Thanh điều hướng, tìm kiếm, nút đăng nhập/xuất
│   └── Footer.js          # Footer chung
│
├── Components/
│   ├── Home.js            # Trang chủ
│   ├── Products.js        # Danh sách sản phẩm, lọc theo danh mục
│   ├── DetailProduct.js   # Chi tiết sản phẩm
│   ├── Cart.js            # Giỏ hàng
│   ├── DetailCart.js      # Xem chi tiết đơn hàng
│   ├── Login.js           # Đăng nhập
│   ├── Register.js        # Đăng ký
│   ├── ProfileCus.js      # Thông tin cá nhân & quản lý đơn hàng
│   ├── ForgotPassword.js  # Quên mật khẩu
│   ├── ResetPassword.js   # Đặt lại mật khẩu
│   ├── PrivateRoute.js    # Bảo vệ route cần đăng nhập
│   └── Admin/             # Các trang quản trị
│
├── redux/
│   ├── store.js           # Cấu hình Redux store + redux-persist
│   ├── authSlice.js       # State đăng nhập khách hàng
│   ├── authSliceAdmin.js  # State đăng nhập admin
│   ├── cartSlice.js       # State giỏ hàng
│   ├── productSlice.js    # State sản phẩm
│   ├── apiRequest.js      # Tất cả hàm gọi API
│   └── createInstance.js  # Tạo axios instance với interceptor JWT
│
├── HTTP/
│   └── http.js            # Cấu hình axios base (baseURL, withCredentials)
│
├── CSS/                   # File CSS tùy chỉnh
├── Icon/                  # Hình ảnh, logo
└── Models/                # Định nghĩa model dữ liệu
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 16
- Backend đang chạy tại `http://localhost:3001`

### Các bước

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy ở môi trường development
npm start
# → Mở http://localhost:3000

# 3. Build production
npm run build
```

---

## 🔐 Biến môi trường

Tạo file `.env` ở thư mục gốc (nếu cần override):

```env
REACT_APP_API_URL=http://localhost:3001
```

> Mặc định `baseURL` được cấu hình trong `src/HTTP/http.js`.

---

## 🔒 Luồng xác thực (Auth Flow)

Ứng dụng sử dụng **Access Token** (lưu trong Redux) + **Refresh Token** (lưu trong `httpOnly cookie`).

```
Đăng nhập
    │
    ▼
Server trả về accessToken (hết hạn sau 120 giây)
+ Set cookie refreshTokenCus (hết hạn sau 365 ngày)
    │
    ▼
Redux lưu { accessToken, ... } vào store (persist sang localStorage)
    │
    ▼
Mỗi request qua axiosJWT:
  ├─ Token còn hạn  → gửi request bình thường
  └─ Token hết hạn  → gọi /api/refreshtokencus
                       → nhận accessToken mới
                       → dispatch loginSuccess cập nhật store
                       → tiếp tục request
    │
    ▼
Nếu server trả 401/403 → tự động dispatch logOutSuccess + xóa cart
```

### Đăng xuất

- Gọi `POST /api/cuslogout` → server xóa cookie `refreshTokenCus`
- Dispatch `logOutSuccess()` → Redux xóa `currentUser`
- Dispatch `getCartLogout()` → Redux xóa giỏ hàng
- Redirect về `/`
- **Nếu API lỗi**: vẫn thực hiện đủ các bước trên, user không bị kẹt

---

## 🗃️ Redux Store

```
store
├── auth (persisted)
│   └── login
│       ├── currentUser   ← { accessToken, idUser, ... } | null
│       ├── isFetching
│       └── error
│
├── cart
│   └── ...
│
└── authAdmin
    └── ...
```

> `authAdmin` được blacklist khỏi persist — admin luôn phải đăng nhập lại khi reload.

---

## 📄 Các trang chính

| Đường dẫn | Component | Mô tả |
|---|---|---|
| `/` | `Home.js` | Trang chủ, banner, sản phẩm nổi bật |
| `/sanpham` | `Products.js` | Danh sách sản phẩm |
| `/sanpham/danhmuc/:id` | `Products.js` | Lọc theo danh mục |
| `/sanpham/search=:keyword` | `Products.js` | Tìm kiếm |
| `/chitietsp/:id` | `DetailProduct.js` | Chi tiết sản phẩm |
| `/cart` | `Cart.js` | Giỏ hàng |
| `/detailcart/:id` | `DetailCart.js` | Chi tiết đơn hàng |
| `/login` | `Login.js` | Đăng nhập |
| `/register` | `Register.js` | Đăng ký |
| `/profilecustomer` | `ProfileCus.js` | Thông tin & đơn hàng (cần đăng nhập) |
| `/forgotpassword` | `ForgotPassword.js` | Quên mật khẩu |
| `/admin/*` | `Admin/` | Trang quản trị (cần đăng nhập admin) |
