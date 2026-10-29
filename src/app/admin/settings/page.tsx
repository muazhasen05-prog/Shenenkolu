import * as React from 'react';
import { requireRole } from '@/lib/auth/session';
import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function AdminSettingsPage() {
  await requireRole(['super_admin'], '/admin');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <span>Institutional Site Settings</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure official woreda metadata, contact points, and primary localization defaults.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base">Institutional Identity</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Organization Full Name
              </label>
              <Input
                defaultValue="Shenen Kolu Woreda Prosperity Party"
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Default Public Locale</label>
              <select
                defaultValue="en"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="en">English (Default)</option>
                <option value="om">Afaan Oromoo</option>
                <option value="am">አማርኛ (Amharic)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Mission Slogan</label>
            <Input defaultValue="Serving our community with dedication, unity, and progress" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Public Inquiries Email</label>
              <Input type="email" defaultValue="info@shenenkolu.gov.et" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Secretariat Phone</label>
              <Input type="tel" defaultValue="+251 11 000 0000" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Physical Office Address</label>
            <Input defaultValue="Shenen Kolu Woreda Administration Complex, Oromia, Ethiopia" />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
