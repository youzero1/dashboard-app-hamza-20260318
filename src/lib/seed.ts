import { getDataSource } from './database';
import { User } from './entities/User';
import { Project } from './entities/Project';
import { Order } from './entities/Order';
import { Activity } from './entities/Activity';
import { Setting } from './entities/Setting';

export async function seedDatabase() {
  const ds = await getDataSource();

  const userRepo = ds.getRepository(User);
  const projectRepo = ds.getRepository(Project);
  const orderRepo = ds.getRepository(Order);
  const activityRepo = ds.getRepository(Activity);
  const settingRepo = ds.getRepository(Setting);

  const existingUsers = await userRepo.count();
  if (existingUsers > 0) return;

  // Seed Users
  const roles = ['admin', 'user', 'editor', 'viewer'];
  const users: User[] = [];
  for (let i = 1; i <= 20; i++) {
    const user = userRepo.create({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: roles[i % roles.length],
    });
    users.push(await userRepo.save(user));
  }

  // Seed Projects
  const statuses = ['active', 'completed', 'archived'];
  const projectTitles = [
    'Website Redesign',
    'Mobile App',
    'API Integration',
    'Data Migration',
    'Cloud Infrastructure',
    'Analytics Dashboard',
    'E-commerce Platform',
    'CRM System',
    'Marketing Campaign',
    'Security Audit',
    'Performance Optimization',
    'Legacy Migration',
    'IoT Platform',
    'AI Chatbot',
    'Blockchain Prototype',
  ];
  for (let i = 0; i < 15; i++) {
    const project = projectRepo.create({
      title: projectTitles[i],
      description: `Description for ${projectTitles[i]}. This project involves multiple stakeholders and complex requirements.`,
      status: statuses[i % statuses.length],
    });
    await projectRepo.save(project);
  }

  // Seed Orders
  const orderStatuses = ['pending', 'completed', 'cancelled'];
  for (let i = 1; i <= 30; i++) {
    const order = orderRepo.create({
      customerName: `Customer ${i}`,
      amount: Math.round(Math.random() * 10000) / 100 + 50,
      status: orderStatuses[i % orderStatuses.length],
    });
    await orderRepo.save(order);
  }

  // Seed Activities
  const activityTypes = ['user_created', 'project_updated', 'order_placed', 'settings_changed', 'login'];
  const activityDescriptions = [
    'New user registered',
    'Project status updated to active',
    'New order placed',
    'Settings updated',
    'Admin logged in',
    'User profile updated',
    'Project completed',
    'Order cancelled',
    'New project created',
    'User role changed',
  ];
  for (let i = 0; i < 20; i++) {
    const activity = activityRepo.create({
      type: activityTypes[i % activityTypes.length],
      description: activityDescriptions[i % activityDescriptions.length],
      user: users[i % users.length].name,
    });
    await activityRepo.save(activity);
  }

  // Seed Settings
  const defaultSettings = [
    { key: 'site_name', value: 'Admin Dashboard' },
    { key: 'admin_email', value: 'admin@example.com' },
    { key: 'items_per_page', value: '10' },
    { key: 'theme', value: 'light' },
  ];
  for (const s of defaultSettings) {
    const existing = await settingRepo.findOne({ where: { key: s.key } });
    if (!existing) {
      await settingRepo.save(settingRepo.create(s));
    }
  }

  console.log('Database seeded successfully');
}
