import { db } from './index';
import { users, products } from './schema';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../shared/constants';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', BCRYPT_SALT_ROUNDS);
  const [admin] = await db.insert(users).values({
    email: 'admin@mallofwesteros.com',
    passwordHash: adminPassword,
    fullName: 'Admin User',
    phone: '+254712345678',
    role: 'admin',
    isVerified: true,
  }).returning();

  console.log('✅ Created admin user:', admin.email);

  // Create sample customer
  const customerPassword = await bcrypt.hash('Customer123!', BCRYPT_SALT_ROUNDS);
  const [customer] = await db.insert(users).values({
    email: 'customer@example.com',
    passwordHash: customerPassword,
    fullName: 'John Doe',
    phone: '+254723456789',
    role: 'customer',
    isVerified: true,
  }).returning();

  console.log('✅ Created customer user:', customer.email);

  // Sample phones
  const phoneProducts = [
    {
      name: 'iPhone 15 Pro Max',
      slug: 'apple-iphone-15-pro-max',
      category: 'phone' as const,
      brand: 'Apple',
      model: '15 Pro Max',
      description: 'The ultimate iPhone with titanium design, A17 Pro chip, and ProMotion display. Experience the future of smartphone technology.',
      specifications: {
        screenSize: '6.7 inches',
        ram: '8GB',
        storage: '256GB',
        camera: '48MP + 12MP + 12MP',
        battery: '4422mAh',
        os: 'iOS 17',
      },
      price: '165000',
      stockQuantity: 15,
      images: ['https://images.unsplash.com/photo-1696446702183-cbd3a2e9d7f0?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      category: 'phone' as const,
      brand: 'Samsung',
      model: 'S24 Ultra',
      description: 'Samsung\'s flagship with 200MP camera, S Pen, and AI features. The most powerful Galaxy phone ever.',
      specifications: {
        screenSize: '6.8 inches',
        ram: '12GB',
        storage: '512GB',
        camera: '200MP + 50MP + 12MP + 10MP',
        battery: '5000mAh',
        os: 'Android 14',
      },
      price: '155000',
      stockQuantity: 20,
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Google Pixel 8 Pro',
      slug: 'google-pixel-8-pro',
      category: 'phone' as const,
      brand: 'Google',
      model: 'Pixel 8 Pro',
      description: 'Google\'s AI-powered flagship with amazing computational photography and pure Android experience.',
      specifications: {
        screenSize: '6.7 inches',
        ram: '12GB',
        storage: '256GB',
        camera: '50MP + 48MP + 48MP',
        battery: '5050mAh',
        os: 'Android 14',
      },
      price: '125000',
      stockQuantity: 12,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
      isFeatured: false,
      isActive: true,
    },
  ];

  // Sample laptops
  const laptopProducts = [
    {
      name: 'MacBook Pro 16" M3 Max',
      slug: 'apple-macbook-pro-16-m3-max',
      category: 'laptop' as const,
      brand: 'Apple',
      model: 'MacBook Pro 16" M3 Max',
      description: 'The most powerful MacBook Pro ever. Perfect for developers, video editors, and creative professionals.',
      specifications: {
        processor: 'Apple M3 Max',
        ram: '36GB',
        storage: '1TB SSD',
        screenSize: '16.2 inches',
        graphicsCard: 'Integrated GPU 40-core',
        os: 'macOS Sonoma',
      },
      price: '385000',
      stockQuantity: 8,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      category: 'laptop' as const,
      brand: 'Dell',
      model: 'XPS 15 9530',
      description: 'Premium Windows laptop with stunning OLED display and powerful performance for demanding tasks.',
      specifications: {
        processor: 'Intel Core i7-13700H',
        ram: '32GB',
        storage: '1TB SSD',
        screenSize: '15.6 inches OLED',
        graphicsCard: 'NVIDIA RTX 4050 6GB',
        os: 'Windows 11 Pro',
      },
      price: '295000',
      stockQuantity: 10,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      slug: 'lenovo-thinkpad-x1-carbon',
      category: 'laptop' as const,
      brand: 'Lenovo',
      model: 'X1 Carbon Gen 11',
      description: 'Ultra-light business laptop with legendary ThinkPad durability and security features.',
      specifications: {
        processor: 'Intel Core i7-1365U',
        ram: '16GB',
        storage: '512GB SSD',
        screenSize: '14 inches',
        graphicsCard: 'Intel Iris Xe',
        os: 'Windows 11 Pro',
      },
      price: '225000',
      stockQuantity: 15,
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      slug: 'asus-rog-zephyrus-g14',
      category: 'laptop' as const,
      brand: 'Asus',
      model: 'ROG Zephyrus G14',
      description: 'Compact gaming powerhouse with AMD Ryzen and NVIDIA RTX. Perfect for gaming and content creation.',
      specifications: {
        processor: 'AMD Ryzen 9 7940HS',
        ram: '32GB',
        storage: '1TB SSD',
        screenSize: '14 inches QHD',
        graphicsCard: 'NVIDIA RTX 4060 8GB',
        os: 'Windows 11 Home',
      },
      price: '245000',
      stockQuantity: 7,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
      isFeatured: false,
      isActive: true,
    },
  ];

  // Insert products
  const allProducts = [...phoneProducts, ...laptopProducts];
  
  for (const product of allProducts) {
    await db.insert(products).values(product);
    console.log(`✅ Created product: ${product.name}`);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@mallofwesteros.com / Admin123!');
  console.log('Customer: customer@example.com / Customer123!');
  
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
