import React, { useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Todos from "./pages/Todos";


import { useAuth } from "./store/auth";

// 
const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuth((s) => s.token);
  
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  const loadStoredAuth = useAuth((s) => s.loadStoredAuth);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <div>
      <nav className="bg-white shadow-sm">
        <div className="container flex justify-between items-center py-4 px-2">
          <Link to="/" className="font-bold text-lg">TodoApp</Link>
          <div className="flex gap-5 text-lg text-black">
            <Link to="/todos">Todos</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />

          {/* Protected Route */}
          <Route
            path="/todos"
            element={
              <Protected>
                <Todos />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
