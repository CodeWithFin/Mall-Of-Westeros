import bcrypt from 'bcrypt';

async function generateHashes() {
  const adminHash = await bcrypt.hash('Admin123!', 10);
  const customerHash = await bcrypt.hash('Customer123!', 10);
  
  console.log(`
INSERT INTO users (email, password_hash, full_name, phone, role, is_verified, is_active)
VALUES 
  ('admin@mallofwesteros.com', '${adminHash}', 'Admin User', '+254712345678', 'admin', true, true),
  ('customer@example.com', '${customerHash}', 'John Doe', '+254723456789', 'customer', true, true);
  `);
}

generateHashes();
