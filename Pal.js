// Pal.js - Supabase PostgreSQL Model
import { supabase } from './utils/supabase.js';

export class Pal {
  static async create(palData) {
    const { data, error } = await supabase
      .from('pals')
      .insert([{
        requester_id: palData.requesterId,
        addressee_id: palData.addresseeId,
        status: palData.status || 'pending'
      }])
      .select(`
        *,
        requester:requester_id(username, avatar_url),
        addressee:addressee_id(username, avatar_url)*
