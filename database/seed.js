import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Insert sample posts
    const { error: postsError } = await supabase
      .from('posts')
      .upsert([
        {
          content: 'Welcome to Socialverse! 🎉 This is a sample post with **markdown** support.',
          author: 'System',
          user_id: null
        },
        {
          content: 'You can use :smile: emojis and *formatting* in your posts!',
          author: 'System',
          user_id: null
        }
      ], { onConflict: 'id' });

    if (postsError) {
      throw postsError;
    }

    console.log('✅ Sample posts created');
    console.log('🎉 Database seeding completed!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
