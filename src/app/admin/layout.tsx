import * as React from 'react';
import { requireAuth } from '@/lib/auth/session';
import { isStaffRole } from '@/lib/auth/roles';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Administration Dashboard | Shenen Kolu Woreda',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAuth('/en/auth/login?redirect=/admin');

  if (!isStaffRole(profile.role)) {
    redirect('/en');
  }

  return (
    <div className="flex min-h-screen bg-muted/20 font-sans">
      <AdminSidebar userRole={profile.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={profile} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
