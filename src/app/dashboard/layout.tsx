import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { seedDatabase } from '@/lib/seed';

async function initializeApp() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Seed error:', error);
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    redirect('/login');
  }

  await initializeApp();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
