'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getLowStockProducts } from '@/lib/store';
import { User } from '@/lib/types';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/');
      return;
    }
    setUser(session);
    setAlertCount(getLowStockProducts().length);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EDEDE8]">
        <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#EDEDE8]">
      <Sidebar user={user} alertCount={alertCount} />
      <main className="flex-1 flex flex-col min-w-0 lg:border-l-2 lg:border-neutral-900">
        <div className="flex-1 p-5 lg:p-6 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
