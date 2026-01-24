'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { clearAuthCookie } from '@/lib/auth';
import { signOut } from 'firebase/auth';

export default function CustomersPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
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
            <div className="flex space-x-8">
              <h1 className="text-xl font-bold text-gray-900">VelocityOS</h1>
              <div className="flex space-x-4 items-center">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                <a href="/customers" className="text-gray-900 font-medium">Customers</a>
                <a href="/communications" className="text-gray-600 hover:text-gray-900">Communications</a>
                <a href="/reports" className="text-gray-600 hover:text-gray-900">Reports</a>
                <a href="/settings" className="text-gray-600 hover:text-gray-900">Settings</a>
              </div>
            </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customers</h2>
          <p className="text-gray-600">
            This is a protected route. Only authenticated users can access this page.
          </p>
        </div>
      </main>
    </div>
  );
}
