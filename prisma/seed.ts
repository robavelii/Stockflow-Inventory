import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local first, then .env
config({ path: '.env.local' });
config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please set it in your .env.local file.\n' +
    'Example: DATABASE_URL=postgresql://user:password@host:port/database'
  );
}

// Prisma 7: Requires adapter for PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Load realistic seed data
const seedDataPath = join(process.cwd(), 'prisma', 'seed-data.json');
const seedData = JSON.parse(readFileSync(seedDataPath, 'utf-8'));

async function main() {
  console.log('🌱 Starting database seed with realistic data...');

  // Create test user (this would normally come from Supabase Auth)
  // For seeding, we'll use a test user ID
  const testUserId = '00000000-0000-0000-0000-000000000001';

  // Clear existing seed data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing seed data...');
  await prisma.orderItem.deleteMany({ where: { order: { userId: testUserId } } });
  await prisma.order.deleteMany({ where: { userId: testUserId } });
  await prisma.product.deleteMany({ where: { userId: testUserId } });
  await prisma.customer.deleteMany({ where: { userId: testUserId } });
  await prisma.userPreference.deleteMany({ where: { userId: testUserId } });
  console.log('✅ Cleaned existing seed data');

  // Seed Products from JSON data
  console.log(`📦 Seeding ${seedData.products.length} products...`);
  const products = [];
  for (const productData of seedData.products) {
    const product = await prisma.product.create({
      data: {
        userId: testUserId,
        name: productData.name,
        sku: productData.sku,
        category: productData.category,
        quantity: productData.quantity,
        minLevel: productData.minLevel,
        price: productData.price,
        cost: productData.cost,
        status: productData.status,
        supplier: productData.supplier,
      },
    });
    products.push(product);
  }
  console.log(`✅ Created ${products.length} products`);

  // Seed Customers from JSON data
  console.log(`👥 Seeding ${seedData.customers.length} customers...`);
  const customers = [];
  for (const customerData of seedData.customers) {
    const customer = await prisma.customer.create({
      data: {
        userId: testUserId,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
      },
    });
    customers.push(customer);
  }
  console.log(`✅ Created ${customers.length} customers`);

  // Seed Orders with realistic data
  console.log('🛒 Creating orders...');
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const orders = [];
  const orderCount = 30; // More realistic number of orders
  
  for (let i = 1; i <= orderCount; i++) {
    // Select 1-6 random products for each order
    const productCount = Math.floor(Math.random() * 6) + 1;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, productCount);
    
    let total = 0;
    const orderItems = [];

    for (const product of selectedProducts) {
      const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 items
      const price = Number(product.price);
      const subtotal = price * quantity;
      total += subtotal;

      orderItems.push({
        productId: product.id,
        quantity,
        price,
        subtotal,
      });
    }

    const customer = customers[Math.floor(Math.random() * customers.length)];
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90)); // Orders from last 90 days

    const order = await prisma.order.create({
      data: {
        userId: testUserId,
        orderNumber: `ORD-${2024}${String(i).padStart(5, '0')}`,
        customerId: customer.id,
        customerName: customer.name,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        itemsCount: orderItems.length,
        createdAt: orderDate,
        orderItems: {
          create: orderItems,
        },
      },
    });
    orders.push(order);
  }
  console.log(`✅ Created ${orders.length} orders with items`);

  // Seed User Preferences
  await prisma.userPreference.create({
    data: {
      userId: testUserId,
      darkMode: false,
      currency: 'USD',
      emailNotifications: true,
      pushNotifications: false,
    },
  });
  console.log('✅ Created user preferences');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

