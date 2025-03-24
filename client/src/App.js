import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import HomeUser from "./components/HomeUser/HomeUser";
import BookUser from "./components/BookUser/BookUser";
import CartUser from "./components/CartUser/CartUser";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user/:userId" element={<HomeUser />} />
          <Route path="/user/:userId/book/:bookId" element={<BookUser />} />
          <Route path="/user/:userId/cart" element={<CartUser />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
