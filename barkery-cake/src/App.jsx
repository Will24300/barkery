import { useState, useEffect, useContext } from "react";
import Home from "./pages/Home";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import AdminForm from "./pages/AdminForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mainpage from "./admin/Mainpage";

export default function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adminpage/*" element={<Mainpage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
