import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-text">MathMate</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
