'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { clearAuthCookie } from '@/lib/auth';
import { signOut } from 'firebase/auth';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await clearAuthCookie();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">VelocityOS Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to VelocityOS</h2>
          <p className="text-gray-600">
            You are successfully authenticated and can access protected routes.
          </p>
          
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-500">
              User: {auth.currentUser?.email || 'Loading...'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
