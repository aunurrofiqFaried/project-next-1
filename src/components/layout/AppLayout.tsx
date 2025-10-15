'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

import { usePathname } from 'next/navigation';
// import { api } from '@/lib/api';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router =useRouter();

  // Return early for auth pages
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return <>{children}</>;
  }

  const verifyToken = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No token found');
      }

      // Send token to API for verification
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      // Token is valid, user data is in data.data
      return data.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);



  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
