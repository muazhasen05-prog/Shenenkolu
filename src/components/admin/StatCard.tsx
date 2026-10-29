import * as React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return 'bg-emerald-500/10 text-emerald-600';
      case 'secondary':
        return 'bg-amber-500/10 text-amber-600';
      case 'accent':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">{title}</span>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${getIconColor()}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-foreground tracking-tight">{value}</div>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
