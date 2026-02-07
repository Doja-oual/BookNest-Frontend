'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <AdminRoute>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    </AdminRoute>
  );
}
