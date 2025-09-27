import { DashboardLayout } from "@/components/DashboardLayout";
import { FlipCard } from "@/components/cards/FlipCard";
import { GlassMorphismCard } from "@/components/cards/GlassMorphismCard";
import { NeumorphismCard } from "@/components/cards/NeumorphismCard";
import { ProgressCard } from "@/components/cards/ProgressCard";
import { DollarSign, ShoppingCart, Target, TrendingUp, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-[var(--color-textSecondary)]">
            Manage your application with our modern dashboard interface.
            Try switching between different color palettes using the selector in the header.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Total Users</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">2,543</p>
              </div>
              <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg">
                <Users className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Revenue</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">$12,543</p>
              </div>
              <div className="p-3 bg-[var(--color-success)]/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-[var(--color-success)]" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Orders</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">1,234</p>
              </div>
              <div className="p-3 bg-[var(--color-warning)]/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-[var(--color-warning)]" />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-textSecondary)]">Growth</p>
                <p className="text-2xl font-bold text-[var(--color-text)]">+12.5%</p>
              </div>
              <div className="p-3 bg-[var(--color-info)]/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[var(--color-info)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Sample Cards</h2>
            <GlassMorphismCard
              title="Dashboard Analytics"
              description="Track your performance with real-time analytics and insights"
              image="/api/placeholder/400/200"
              stats={[
                { label: "Views", value: "12.5K" },
                { label: "Likes", value: "1.2K" },
                { label: "Shares", value: "340" }
              ]}
            />
            <ProgressCard
              title="Project Completion"
              description="Current project progress and milestones"
              progress={75}
              icon={<Target className="w-6 h-6 text-white" />}
              color="blue"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Interactive Cards</h2>
            <FlipCard
              frontContent={
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Click to Flip</h3>
                    <p className="text-blue-100">Hover and click to see the back side of this card</p>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              }
              backContent={
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Back Side</h3>
                    <p className="text-purple-100">This is the back content of the flip card</p>
                  </div>
                  <div className="text-4xl">✨</div>
                </div>
              }
            />
            <NeumorphismCard
              icon={<Zap className="w-8 h-8 text-gray-600" />}
              title="Performance"
              description="System performance metrics"
              value="98.5%"
              trend={{ value: "+5.2%", isPositive: true }}
            />
          </div>
        </div>

        {/* Color Palette Demo */}
        <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Color Palette Demo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-[var(--color-primary)] rounded-lg"></div>
              <p className="text-sm text-[var(--color-textSecondary)]">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-[var(--color-secondary)] rounded-lg"></div>
              <p className="text-sm text-[var(--color-textSecondary)]">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-[var(--color-accent)] rounded-lg"></div>
              <p className="text-sm text-[var(--color-textSecondary)]">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-[var(--color-success)] rounded-lg"></div>
              <p className="text-sm text-[var(--color-textSecondary)]">Success</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
