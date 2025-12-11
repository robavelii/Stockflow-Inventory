import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AdminUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

const adminUsers: AdminUser[] = [
  {
    email: 'robelfekadu@gmail.com',
    password: 'Admin@123456',
    name: 'System Administrator',
    role: 'Admin',
  },
  {
    email: 'stockflow.manager@gmail.com',
    password: 'Manager@123456',
    name: 'Warehouse Manager',
    role: 'Manager',
  },
  {
    email: 'stockflow.demo@gmail.com',
    password: 'Demo@123456',
    name: 'Demo User',
    role: 'Viewer',
  },
];

async function seedAdminUsers() {
  console.log('🌱 Starting admin user seeding...\n');

  for (const user of adminUsers) {
    console.log(`Creating user: ${user.email}`);

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
          full_name: user.name,
          role: user.role,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`  ⚠️  User ${user.email} already exists, skipping...`);
      } else {
        console.error(`  ❌ Error creating ${user.email}:`, error.message);
      }
    } else if (data.user) {
      console.log(`  ✅ Created ${user.email} with role: ${user.role}`);
    }
  }

  console.log('\n🎉 Admin user seeding completed!');
  console.log('\n📋 Test Credentials:');
  console.log('─'.repeat(60));
  for (const user of adminUsers) {
    console.log(`  ${user.role.padEnd(10)} | ${user.email.padEnd(30)} | ${user.password}`);
  }
  console.log('─'.repeat(60));
  console.log('\n⚠️  Note: Users need to verify their email before signing in,');
  console.log('   or disable email verification in Supabase dashboard for testing.');
}

seedAdminUsers().catch(console.error);