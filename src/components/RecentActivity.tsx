'use client';

import { Activity, User, FolderKanban, ShoppingCart, Settings, LogIn } from 'lucide-react';

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  user: string;
  createdAt: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  user_created: { icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
  project_updated: { icon: FolderKanban, color: 'text-purple-600', bg: 'bg-purple-50' },
  order_placed: { icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
  settings_changed: { icon: Settings, color: 'text-gray-600', bg: 'bg-gray-50' },
  login: { icon: LogIn, color: 'text-green-600', bg: 'bg-green-50' },
};

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <Activity className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {activities.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No recent activity</div>
        ) : activities.map((a) => {
          const config = typeConfig[a.type] || { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-50' };
          const Icon = config.icon;
          return (
            <div key={a.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className={`p-1.5 rounded-lg mt-0.5 flex-shrink-0 ${config.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{a.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.user && `by ${a.user} • `}{getRelativeTime(a.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
