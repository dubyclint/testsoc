import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log('🚀 Starting database migrations...');

  for (const file of migrationFiles) {
    console.log(`📝 Running migration: ${file}`);
    
    const sqlContent = fs.readFileSync(
      path.join(migrationsDir, file), 
      'utf8'
    );

    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: sqlContent 
      });
      
      if (error) {
        throw error;
      }
      
      console.log(`✅ Migration ${file} completed successfully`);
    } catch (error) {
      console.error(`❌ Migration ${file} failed:`, error.message);
      process.exit(1);
    }
  }

  console.log('🎉 All migrations completed successfully!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(console.error);
}

export { runMigrations };
