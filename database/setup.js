import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  console.log('Please check your .env file and ensure these variables are set:');
  console.log('- SUPABASE_URL=https://your-project.supabase.co');
  console.log('- SUPABASE_SERVICE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql, description) {
  try {
    console.log(`📝 ${description}...`);
    
    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec', { 
        sql: statement 
      });
      
      if (error) {
        throw error;
      }
    }
    
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function runMigrations() {
  console.log('🚀 Starting Socialverse database setup...\n');

  // Migration 1: Create tables
  const createTablesSQL = `
    -- Create posts table
    CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        content TEXT NOT NULL,
        author VARCHAR(255),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create profiles table
    CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email VARCHAR(255),
        username VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        is_verified BOOLEAN DEFAULT FALSE,
        rank VARCHAR(50),
        rank_points INTEGER DEFAULT 0,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  if (!await executeSQL(createTablesSQL, 'Creating tables')) {
    process.exit(1);
  }

  // Migration 2: Enable RLS
  const rlsSQL = `
    ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  `;

  if (!await executeSQL(rlsSQL, 'Enabling Row Level Security')) {
    process.exit(1);
  }

  // Migration 3: Create policies
  const policiesSQL = `
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
    DROP POLICY IF EXISTS "Users can create posts" ON posts;
    DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
    DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

    -- Create policies for posts
    CREATE POLICY "Posts are viewable by everyone" ON posts
        FOR SELECT USING (true);

    CREATE POLICY "Users can create posts" ON posts
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

    CREATE POLICY "Users can update their own posts" ON posts
        FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own posts" ON posts
        FOR DELETE USING (auth.uid() = user_id);

    -- Create policies for profiles
    CREATE POLICY "Profiles are viewable by everyone" ON profiles
        FOR SELECT USING (true);

    CREATE POLICY "Users can update their own profile" ON profiles
        FOR UPDATE USING (auth.uid() = id);

    CREATE POLICY "Users can insert their own profile" ON profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
  `;

  if (!await executeSQL(policiesSQL, 'Creating security policies')) {
    process.exit(1);
  }

  // Migration 4: Create indexes and triggers
  const indexesSQL = `
    -- Create indexes
    CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
    CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

    -- Create trigger function for updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

    -- Create triggers
    CREATE TRIGGER update_posts_updated_at 
        BEFORE UPDATE ON posts 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_profiles_updated_at 
        BEFORE UPDATE ON profiles 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
  `;

  if (!await executeSQL(indexesSQL, 'Creating indexes and triggers')) {
    process.exit(1);
  }

  console.log('\n🎉 Database setup completed successfully!');
  console.log('Your Socialverse database is ready to use.');
}

// Run migrations
runMigrations().catch(error => {
  console.error('💥 Migration failed:', error);
  process.exit(1);
});
