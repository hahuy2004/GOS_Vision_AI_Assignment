# 🐱🐶 Dog Cat Classifier

Một ứng dụng web full-stack sử dụng mô hình CNN từ TensorFlow và Keras để phân loại ảnh là chó hoặc mèo.

## Tính năng

- **FastAPI Backend**: API hiệu năng cao với tài liệu tự động
- **React Frontend**: Giao diện người dùng hiện đại, đáp ứng tốt trên nhiều thiết bị
- **Machine Learning**: Mô hình TensorFlow đã huấn luyện sẵn để phân loại ảnh
- **Dự đoán thời gian thực**: Tải lên ảnh và nhận kết quả ngay lập tức
- **Độ tin cậy**: Hiển thị phần trăm độ tin cậy của dự đoán

## Đường dẫn các trang demo:
- **Đường dẫn backend:** https://gos-vision-be.onrender.com
- **Đường dẫn trang web:** https://gos-assignment.netlify.app/
- **Lưu ý:** Do backend được deploy lên **Render**, do đó khi sử dụng trang web thì cần chờ khoảng 50s trở lên để backend khởi động hoàn toàn.

## Kiến trúc dự án

```
GOS_CV/
├── code/
│   ├── backend/           # Máy chủ FastAPI
│   │   ├── main.py        # Các endpoint API
│   │   ├── requirements.txt
│   │   └── dog_cat_classifier_final_no_opt.h5  # Mô hình ML
│   └── frontend/          # Ứng dụng React
│       ├── src/
│       │   ├── App.tsx    # Thành phần chính
│       │   ├── App.css    # Style
│       │   └── ...
│       └── package.json
├── create_data/           # Dữ liệu huấn luyện và notebook
└── model/                 # Notebook huấn luyện model

```

## Hướng dẫn sử dụng nhanh

### Yêu cầu

- Python 3.10 trở lên
- Node.js 16 trở lên
- npm hoặc yarn

### Cài đặt Backend

1. Di chuyển vào thư mục backend:
```bash
cd code/backend
```

2. Tạo môi trường .venv và cài đặt các thư viện Python:
```bash
python -m venv .venv
pip install -r requirements.txt
```

3. Đảm bảo file mô hình `dog_cat_classifier_final_no_opt.h5` nằm trong thư mục backend

4. Khởi động máy chủ FastAPI:
```bash
.venv\Scripts\activate
python main.py
```

API sẽ chạy tại: http://localhost:8000  
- Tài liệu API: http://localhost:8000/docs  
- ReDoc: http://localhost:8000/redoc

### Cài đặt Frontend

1. Di chuyển vào thư mục frontend:
```bash
cd code/frontend
```

2. Cài đặt các package:
```bash
npm install
```

3. Khởi động server phát triển:
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## Cách sử dụng

1. Mở frontend trên trình duyệt (http://localhost:5173). Có thể `Ctrl -` để dễ xem hơn. 
2. Nhấn "Chọn ảnh" để chọn ảnh chó hoặc mèo
3. Nhấn "Dự đoán" để nhận kết quả phân loại
4. Xem kết quả dự đoán và độ tin cậy

## Các endpoint API

### GET /
Kiểm tra trạng thái server

### GET /model/info
Lấy thông tin về mô hình đã tải

### POST /predict
Tải lên ảnh để phân loại

**Yêu cầu:**
- Phương thức: POST
- Content-Type: multipart/form-data
- Body: file (file ảnh)

**Phản hồi:**
```json
{
  "success": true,
  "filename": "example.jpg",
  "prediction": {
    "class": "dog",
    "confidence": 0.85,
    "raw_prediction": 0.85
  }
}
```

## Thông tin mô hình

- **Đầu vào**: Ảnh RGB 224x224
- **Đầu ra**: Phân loại nhị phân (0 = mèo, 1 = chó)
- **Framework**: TensorFlow/Keras
- **Định dạng**: file .h5

## Phát triển

### Backend

Backend sử dụng FastAPI với các tính năng:
- Tài liệu API tự động
- Middleware CORS để kết nối frontend
- Xử lý ảnh với OpenCV và PIL
- Tải và dự đoán bằng mô hình TensorFlow

### Frontend

Frontend xây dựng bằng React và TypeScript:
- Upload file hỗ trợ kéo & thả
- Xem trước ảnh
- Hiển thị kết quả dự đoán thời gian thực
- Thiết kế đáp ứng, hiện đại

## Khắc phục sự cố

### Backend

1. **Không tìm thấy mô hình**: Đảm bảo file `dog_cat_classifier_final_no_opt.h5` nằm trong thư mục backend
2. **Thiếu thư viện**: Cài đặt đủ yêu cầu: `pip install -r requirements.txt`
3. **Trùng cổng**: Đổi cổng trong `main.py` nếu cổng 8000 đã bị chiếm

### Frontend

1. **Lỗi CORS**: Đảm bảo backend chạy tại http://localhost:8000
2. **Thiếu package**: Chạy `npm install` để cài đặt đủ package
3. **Lỗi build**: Kiểm tra phiên bản Node.js (yêu cầu 16 trở lên)