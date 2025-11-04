#  Ứng dụng Quản lý Sản phẩm

##  Hướng dẫn khởi tạo dự án

### 1. Clone dự án
```bash
git clone <repository-url>
cd manager
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cài đặt json-server (nếu chưa có)
```bash
npm install -g json-server
```

### 4. Chạy API backend
Mở terminal thứ nhất và chạy:
```bash
json-server --watch db.json --port 3000
```
