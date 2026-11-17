import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '../../contexts/AuthContext';
import { ADMIN_EMAILS } from '../../lib/constants';

export default function AdminLayout() {
  const { userData, loading } = useAuth();
  
  const isAdmin = userData?.email && (
    ADMIN_EMAILS.includes(userData.email.toLowerCase()) || 
    userData.is_admin === true
  );

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex selection:bg-purple-600 selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-8 bg-[#050505]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
