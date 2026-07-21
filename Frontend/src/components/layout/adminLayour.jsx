import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

/**
 * Every /admin/* route renders inside this shell. Course/Topic/Quiz/User
 * pages never import Sidebar or Navbar themselves — they just render
 * their own content and AdminLayout supplies the chrome around it via
 * React Router's nested-route <Outlet />.
 */
export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto bg-[#faf9ff]">
        <Outlet />
      </main>
    </div>
  );
}
