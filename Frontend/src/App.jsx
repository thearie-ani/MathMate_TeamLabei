import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { useContext } from "react";

// Pages
import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/student/Dashboard";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import Home from "./pages/Home";

/* ---------------------------
   PROTECTED ROUTE COMPONENT
---------------------------- */
function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  // not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // role check (admin/student)
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

/* ---------------------------
         APP
---------------------------- */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          {/* STUDENT ROUTES */}
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* ADMIN ROUTES */}
          {/* <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* fallback */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}