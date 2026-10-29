import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Target, Eye, Award, Users, Landmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const tAbout = await getTranslations({ locale, namespace: 'about' });

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
            <Landmark className="h-4 w-4" />
            <span>Shenen Kolu Woreda</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {tAbout('title')}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            {tAbout('subtitle')}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {tAbout('missionTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {tAbout('missionDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-secondary/5">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {tAbout('visionTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {tAbout('visionDesc')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values Section */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {tAbout('valuesTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card space-y-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-primary flex items-center justify-center mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Public Integrity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transparent decision-making, anti-corruption safeguards, and responsive public accountability.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-secondary flex items-center justify-center mb-3">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Civic Participation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Empowering every kebele through participatory budgeting, public forums, and youth inclusion.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card space-y-2">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 text-accent flex items-center justify-center mb-3">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-foreground">Shared Prosperity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Targeted investments in modern irrigation, clean drinking water, education, and rural roads.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership & Coordination Structure */}
        <div className="rounded-2xl border border-border bg-muted/30 p-8 space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            {tAbout('leadershipTitle')}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tAbout('leadershipDesc')}
          </p>
          <div className="pt-2 text-xs text-muted-foreground">
            Shenen Kolu Woreda Administration Complex &bull; Oromia Regional State &bull; Ethiopia
          </div>
        </div>
      </div>
    </div>
  );
}
