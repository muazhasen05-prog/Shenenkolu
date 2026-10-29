'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Bell,
  Image as ImageIcon,
  Video,
  Users,
  Send,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { UserRole } from '@/types/database';

interface AdminSidebarProps {
  userRole: UserRole;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isSuperAdmin = userRole === 'super_admin';
  const isEditorOrAbove = userRole === 'super_admin' || userRole === 'editor';

  const navItems = [
    {
      href: '/admin',
      label: 'Overview',
      icon: LayoutDashboard,
      allowed: true,
    },
    {
      href: '/admin/news',
      label: 'News Management',
      icon: Newspaper,
      allowed: isEditorOrAbove,
    },
    {
      href: '/admin/announcements',
      label: 'Announcements',
      icon: Bell,
      allowed: isEditorOrAbove,
    },
    {
      href: '/admin/gallery',
      label: 'Media Gallery',
      icon: ImageIcon,
      allowed: isEditorOrAbove,
    },
    {
      href: '/admin/meetings',
      label: 'Meetings & Forums',
      icon: Video,
      allowed: true,
    },
    {
      href: '/admin/users',
      label: 'User & Roles',
      icon: Users,
      allowed: isSuperAdmin,
    },
    {
      href: '/admin/notifications',
      label: 'Push Notifications',
      icon: Send,
      allowed: isEditorOrAbove,
    },
    {
      href: '/admin/settings',
      label: 'Site Settings',
      icon: Settings,
      allowed: isSuperAdmin,
    },
    {
      href: '/admin/audit-logs',
      label: 'Audit Trail',
      icon: History,
      allowed: isSuperAdmin,
    },
  ];

  return (
    <aside
      className={`relative border-r border-border bg-card transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Area */}
        <div className="flex items-center justify-between p-4 border-b border-border h-16">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground font-black flex items-center justify-center shrink-0 shadow-sm">
              SK
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm text-foreground line-clamp-1">
                  Shenen Kolu
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Administration
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems
            .filter((item) => item.allowed)
            .map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Role notice bottom card */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="rounded-lg bg-muted/60 p-3 flex items-center gap-2.5 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
            <div className="line-clamp-2">
              <span className="font-semibold text-foreground capitalize">{userRole.replace('_', ' ')}</span> session active.
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
