import { supabase } from '~/utils/supabase';

export default defineEventHandler(async () => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) throw createError({ statusCode: 500, statusMessage: error.message });
  return data;
});
