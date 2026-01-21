import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL!);

// High-quality product images from Unsplash
const productImages: Record<string, string[]> = {
  // Apple Phones
  'iPhone 16 Pro': [
    'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800',
    'https://images.unsplash.com/photo-1696446702228-bdc8be8b2136?w=800',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'
  ],
  'iPhone 16': [
    'https://images.unsplash.com/photo-1696446702883-2b1b8b766ca7?w=800',
    'https://images.unsplash.com/photo-1695653422715-991ec3a0db7a?w=800',
    'https://images.unsplash.com/photo-1695653422715-991ec3a0db7a?w=800'
  ],
  'iPhone 16 Plus': [
    'https://images.unsplash.com/photo-1592286927505-da5e328f1e0e?w=800',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800',
    'https://images.unsplash.com/photo-1678652197950-eb97d96c86c0?w=800'
  ],
  
  // Samsung Phones
  'Galaxy S26 Ultra': [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    'https://images.unsplash.com/photo-1591122947157-26bad3a2bc99?w=800',
    'https://images.unsplash.com/photo-1686236932694-8251268f2e38?w=800'
  ],
  'Galaxy S26': [
    'https://images.unsplash.com/photo-1672948635653-4c570f20eda5?w=800',
    'https://images.unsplash.com/photo-1678685888221-f0d297ea5e29?w=800',
    'https://images.unsplash.com/photo-1674490272046-0a1c93c39ad3?w=800'
  ],
  'Galaxy Z Fold 6': [
    'https://images.unsplash.com/photo-1686499459267-20f8af2d6750?w=800',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800'
  ],
  'Galaxy Z Flip 6': [
    'https://images.unsplash.com/photo-1676410791111-e2bd8d6688d2?w=800',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
    'https://images.unsplash.com/photo-1678999344849-c4a2fd8c320a?w=800'
  ],
  
  // Google Phones
  'Pixel 9 Pro': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800'
  ],
  'Pixel 9': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
  ],
  
  // OnePlus Phones
  'OnePlus 13 Pro': [
    'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
    'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800'
  ],
  'OnePlus 13': [
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
  ],
  
  // Xiaomi Phones
  'Xiaomi 15 Pro': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800'
  ],
  
  // Nothing Phones
  'Nothing Phone (3)': [
    'https://images.unsplash.com/photo-1675525438747-9e5b8f09c3cc?w=800',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
  ],
  
  // Apple Laptops
  'MacBook Pro 14" M4': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
    'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800'
  ],
  'MacBook Pro 16" M4 Max': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800'
  ],
  'MacBook Air 13" M4': [
    'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
  ],
  'MacBook Air 15" M4': [
    'https://images.unsplash.com/photo-1606229365485-93a3b8a9c43d?w=800',
    'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
  ],
  
  // Dell Laptops
  'XPS 13 Plus': [
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
  ],
  'XPS 15': [
    'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
  ],
  
  // HP Laptops
  'Spectre x360 14': [
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
  ],
  
  // Lenovo Laptops
  'ThinkPad X1 Carbon Gen 12': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
  ],
  'Yoga 9i': [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
  ],
  
  // ASUS Laptops
  'ROG Zephyrus G16': [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
  ],
  'Zenbook 14 OLED': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
  ],
  
  // Microsoft Laptops
  'Surface Laptop 7': [
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'
  ]
};

async function updateProductImages() {
  try {
    console.log('📸 Updating product images...\n');
    
    const products = await sql`SELECT id, name FROM products`;
    let updated = 0;
    let notFound = 0;
    
    for (const product of products) {
      const images = productImages[product.name];
      
      if (images) {
        await sql`
          UPDATE products 
          SET images = ${JSON.stringify(images)}
          WHERE id = ${product.id}
        `;
        console.log(`✅ Updated: ${product.name}`);
        updated++;
      } else {
        console.log(`⚠️  No images found for: ${product.name}`);
        notFound++;
      }
    }
    
    console.log(`\n✨ Updated ${updated} products`);
    if (notFound > 0) {
      console.log(`⚠️  ${notFound} products need manual image assignment`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateProductImages();
