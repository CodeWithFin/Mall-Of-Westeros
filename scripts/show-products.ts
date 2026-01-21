import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL!);

async function showProducts() {
  try {
    const products = await sql`
      SELECT name, category, brand, price, stock_quantity 
      FROM products 
      ORDER BY category, brand, name
    `;

    const phones = products.filter(p => p.category === 'phone');
    const laptops = products.filter(p => p.category === 'laptop');

    console.log('\n📱 PHONES (' + phones.length + '):');
    phones.forEach(p => {
      console.log(`  • ${p.brand} ${p.name} - $${p.price} (Stock: ${p.stock_quantity})`);
    });

    console.log('\n💻 LAPTOPS (' + laptops.length + '):');
    laptops.forEach(p => {
      console.log(`  • ${p.brand} ${p.name} - $${p.price} (Stock: ${p.stock_quantity})`);
    });

    console.log(`\n✅ Total: ${products.length} products in Neon database`);
    console.log(`\n⚠️  Missing 3 products (failed during CSV import due to connection timeouts)`);
  } catch (error) {
    console.error('Error:', error);
  }
}

showProducts();
