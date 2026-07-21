
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import StudentSidebar from "./StudentSidebar";
import ChatWidget from "../chat/ChatWidget.jsx";

export default function StudentLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/", {
      replace: true
    });
  };
  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9ff]">

      {/* Sidebar stays fixed */}
      <StudentSidebar onLogout={handleLogout} />

      {/* Content scrolls */}
      <main
        className="
          flex-1
          overflow-y-auto
          h-screen
          p-6
        "
      >
        <Outlet />
      </main>
      <ChatWidget/>
    </div>
  );
}
