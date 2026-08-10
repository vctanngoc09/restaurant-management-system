import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // BẮT BUỘC: Import CSS của Toast
import AppRoutes from "./routes/AppRoutes"; // Hoặc import AppRouter từ "./router/AppRouter" tùy tên thư mục bạn đặt

function App() {
  return (
    <>
      {/* Vỏ bọc hiển thị thông báo góc màn hình (Thành công, Thất bại) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppRoutes />
    </>
  );
}

export default App;
