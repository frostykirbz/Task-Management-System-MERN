import React, { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./App.css"

// My Components
import LoginAuth from "./components/LoginAuth"
import AdminHome from "./components/AdminHome"
import UserHome from "./components/UserHome"
import AdminUserHome from "./components/AdminUserHome"
import AdminUserAdd from "./components/AdminUserAdd"
import AdminUserEdit from "./components/AdminUserEdit"
import AdminGroupAdd from "./components/AdminGroupAdd"
import AdminGroupEdit from "./components/AdminGroupEdit"
import AdminGroupHome from "./components/AdminGroupHome"
import UserEdit from "./components/UserEdit"
import DashBoard from "./components/DashBoard"
import ProtectedRoutes from "./components/ProtectedRoutes"

function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("username")))

  return (
    <BrowserRouter>
      <LoginAuth loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path="/" element={loggedIn ? localStorage.getItem("admin") === "true" ? <AdminHome /> : <UserHome /> : <></>} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin-user-home" element={<AdminUserHome />} />
          <Route path="/admin-user-add" element={<AdminUserAdd />} />
          <Route path="/admin-user-update/:id" element={<AdminUserEdit />} />
          <Route path="/admin-group-home" element={<AdminGroupHome />} />
          <Route path="/admin-group-add" element={<AdminGroupAdd />} />
          <Route path="/admin-group-update/:id" element={<AdminGroupEdit />} />
          <Route path="/user-update" element={<UserEdit />} />
          <Route path="/dashboard/:id" element={<DashBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
