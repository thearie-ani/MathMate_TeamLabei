import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

/**
 * Every /admin/* route renders inside this shell. Course/Topic/Quiz/User
 * pages never import Sidebar or Navbar themselves — they just render
 * their own content and AdminLayout supplies the chrome around it via
 * React Router's nested-route <Outlet />.
 */
export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8f7ff]">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 min-w-0">
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
