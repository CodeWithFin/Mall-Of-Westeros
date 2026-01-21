import { db } from './index.js';
import { products } from './schema.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importProductsFromCSV() {
  try {
    console.log('📦 Starting product import from CSV...');
    
    const csvPath = path.join(__dirname, '../../products-import-template.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    let successCount = 0;
    let errorCount = 0;
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Parse CSV line with proper quote handling
      const values: string[] = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          if (inQuotes && line[j + 1] === '"') {
            currentValue += '"';
            j++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue); // Push last value
      
      try {
        const productData = {
          name: values[0],
          slug: values[1],
          category: values[2] as 'phone' | 'laptop',
          brand: values[3],
          model: values[4],
          description: values[5],
          specifications: JSON.parse(values[6]),
          price: values[7],
          currency: values[8],
          stockQuantity: parseInt(values[9]),
          images: JSON.parse(values[10]),
          isFeatured: values[11] === 'true',
          isActive: values[12] === 'true',
        };
        
        await db.insert(products).values(productData);
        successCount++;
        console.log(`✅ Imported: ${productData.name}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error importing row ${i}:`, error);
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log('\n🎉 Import complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during import:', error);
    process.exit(1);
  }
}

importProductsFromCSV();
