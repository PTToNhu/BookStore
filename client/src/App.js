import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import HomeUser from "./components/HomeUser/HomeUser";
import BookUser from "./components/BookUser/BookUser";
import CartUser from "./components/CartUser/CartUser";
import { AuthProvider } from "./components/AuthContext";
import BookSearch from "./components/BookSearch/BookSearch";
import BookManagement from "./components/BookManagement/BookManagement";
import BookDetail from "./components/BookManagement/BookDetail";
import StaffProfile from "./components/Staff/StaffInfo";
import OrderManagement from "./components/ManageOrder/ManageOrder";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/customer/:userId" element={<HomeUser />} />
          <Route path="/customer/:userId/book/:bookId" element={<BookUser />} />
          <Route path="/customer/:userId/cart" element={<CartUser />} />
          <Route
            path="/customer/:userId/book/search"
            element={<BookSearch />}
          ></Route>
          <Route path="/management-book" element={<BookManagement />}></Route>
          <Route
            path="/management-book/:bookId"
            element={<BookDetail />}
          ></Route>
          <Route path="/:staffId/profile" element={<StaffProfile />}></Route>
          <Route
            path="/management-order/:staffId"
            element={<OrderManagement />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
