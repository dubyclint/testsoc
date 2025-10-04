// Trade.js - Supabase PostgreSQL Model
import { supabase } from './utils/supabase.js';

export class Trade {
  static async create(tradeData) {
    const { data, error } = await supabase
      .from('trades')
      .insert([{
        seller_id: tradeData.sellerId,
        buyer_id: tradeData.buyerId,
        currency_sell: tradeData.currency,
        currency_buy: tradeData.currencyBuy || 'USD',
        amount: tradeData.amount,
        price: tradeData.price || tradeData.amount,
        total_value: tradeData.amount * (tradeData.price || 1),
        payment_method: tradeData.paymentMethod || 'Bank Transfer',
        trade_type: tradeData.tradeType || 'sell',
        status: tradeData.status || 'pending',
        notes: tradeData.notes,
        terms: tradeData.terms,
        expires_at: tradeData.expiresAt
      }])
      .select(`
        *,
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async find(filter = {}) {
    let query = supabase
      .from('trades')
      .select(`
        *,
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `);

    if (filter.buyerId) {
      query = query.eq('buyer_id', filter.buyerId);
    }
    if (filter.sellerId) {
      query = query.eq('seller_id', filter.sellerId);
    }
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.currency) {
      query = query.eq('currency_sell', filter.currency);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('trades')
      .select(`
        *,
        seller:seller_id(username, avatar_url, reputation_score),
        buyer:buyer_id(username, avatar_url, reputation_score),
        escrows(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findOne(filter) {
    let query = supabase
      .from('trades')
      .select(`
        *,
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `);

    if (filter.buyerId) {
      query = query.eq('buyer_id', filter.buyerId);
    }
    if (filter.sellerId) {
      query = query.eq('seller_id', filter.sellerId);
    }
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.id) {
      query = query.eq('id', filter.id);
    }

    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async save(tradeData) {
    if (tradeData.id) {
      // Update existing
      const { data, error } = await supabase
        .from('trades')
        .update({
          status: tradeData.status,
          amount: tradeData.amount,
          price: tradeData.price,
          notes: tradeData.notes,
          updated_at: new Date().toISOString(),
          ...(tradeData.status === 'completed' && { completed_at: new Date().toISOString() })
        })
        .eq('id', tradeData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new
      return await this.create(tradeData);
    }
  }

  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from('trades')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
        ...(updateData.status === 'completed' && { completed_at: new Date().toISOString() })
      })
      .eq('id', id)
      .select(`
        *,
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserTrades(userId) {
    const { data, error } = await supabase
      .from('trades')
      .select(`
        *,
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `)
      .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('trades')
      .update({ 
        status,
        updated_at: new Date().toISOString(),
        ...(status === 'completed' && { completed_at: new Date().toISOString() })
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
