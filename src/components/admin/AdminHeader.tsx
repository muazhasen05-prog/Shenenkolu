'use client';

import * as React from 'react';
import Link from 'next/link';
import { Profile } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';

export function AdminHeader({ profile }: { profile: Profile }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-foreground hidden sm:inline">
          Content & System Administration
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Link back to public site */}
        <Link
          href="/en"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>View Public Site</span>
        </Link>

        <ThemeToggle />

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            <User className="h-4 w-4" />
          </div>

          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground line-clamp-1">
              {profile.full_name}
            </span>
            <span className="text-[10px] text-muted-foreground line-clamp-1">
              {profile.email}
            </span>
          </div>

          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
            {profile.role.replace('_', ' ')}
          </Badge>

          {/* Sign Out Action */}
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
