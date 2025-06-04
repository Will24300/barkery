import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { HookContextProvider } from "../context/HookContext";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <>
      <HookContextProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </HookContextProvider>
    </>
  );
}
