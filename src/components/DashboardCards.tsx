'use client';

import { Users, FolderKanban, DollarSign, ShoppingCart } from 'lucide-react';

interface Props {
  totalUsers: number;
  totalProjects: number;
  totalRevenue: number;
  totalOrders: number;
}

export default function DashboardCards({ totalUsers, totalProjects, totalRevenue, totalOrders }: Props) {
  const cards = [
    {
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      label: 'Total Projects',
      value: totalProjects.toLocaleString(),
      icon: FolderKanban,
      color: 'bg-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-orange-500',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.text}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
