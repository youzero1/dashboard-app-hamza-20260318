import { getDataSource } from '@/lib/database';
import { User } from '@/lib/entities/User';
import { Project } from '@/lib/entities/Project';
import { Order } from '@/lib/entities/Order';
import { Activity } from '@/lib/entities/Activity';
import DashboardCards from '@/components/DashboardCards';
import RecentActivity from '@/components/RecentActivity';
import DashboardCharts from '@/components/DashboardCharts';

async function getDashboardData() {
  const ds = await getDataSource();

  const [totalUsers, totalProjects, orders, activities] = await Promise.all([
    ds.getRepository(User).count(),
    ds.getRepository(Project).count(),
    ds.getRepository(Order).find(),
    ds.getRepository(Activity).find({
      order: { createdAt: 'DESC' },
      take: 10,
    }),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.amount, 0);

  // Monthly revenue (last 6 months)
  const now = new Date();
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const revenue = orders
      .filter((o) => {
        const orderDate = new Date(o.createdAt);
        return (
          o.status === 'completed' &&
          orderDate.getMonth() === d.getMonth() &&
          orderDate.getFullYear() === d.getFullYear()
        );
      })
      .reduce((sum, o) => sum + o.amount, 0);
    monthlyRevenue.push({ month: monthName, revenue: Math.round(revenue * 100) / 100 });
  }

  // Monthly user signups (last 6 months)
  const allUsers = await ds.getRepository(User).find();
  const monthlySignups = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const count = allUsers.filter((u) => {
      const userDate = new Date(u.createdAt);
      return (
        userDate.getMonth() === d.getMonth() &&
        userDate.getFullYear() === d.getFullYear()
      );
    }).length;
    monthlySignups.push({ month: monthName, signups: count });
  }

  return {
    totalUsers,
    totalProjects,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders: orders.length,
    activities: activities.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      user: a.user,
      createdAt: a.createdAt.toISOString(),
    })),
    monthlyRevenue,
    monthlySignups,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      <DashboardCards
        totalUsers={data.totalUsers}
        totalProjects={data.totalProjects}
        totalRevenue={data.totalRevenue}
        totalOrders={data.totalOrders}
      />

      <DashboardCharts
        monthlyRevenue={data.monthlyRevenue}
        monthlySignups={data.monthlySignups}
      />

      <RecentActivity activities={data.activities} />
    </div>
  );
}
