import fs from 'fs';
import path from 'path';

const outputDir = '.output';
const serverFile = path.join(outputDir, 'server', 'index.mjs');

console.log('🔍 Verifying build output...');

if (!fs.existsSync(outputDir)) {
  console.error('❌ .output directory does not exist');
  process.exit(1);
}

if (!fs.existsSync(serverFile)) {
  console.error('❌ Server entry point does not exist:', serverFile);
  console.log('📁 Contents of .output:');
  fs.readdirSync(outputDir).forEach(file => {
    console.log(`  - ${file}`);
  });
  process.exit(1);
}

console.log('✅ Build output verified successfully');
console.log(`📦 Server entry point found: ${serverFile}`);

// Check file size
const stats = fs.statSync(serverFile);
console.log(`📊 Server file size: ${(stats.size / 1024).toFixed(2)} KB`);
