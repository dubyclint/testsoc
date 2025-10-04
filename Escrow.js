// Escrow.js - Supabase PostgreSQL Model
import { supabase } from './utils/supabase.js';

export class Escrow {
  static async create(escrowData) {
    const { data, error } = await supabase
      .from('escrows')
      .insert([{
        trade_id: escrowData.tradeId,
        seller_id: escrowData.sellerId,
        buyer_id: escrowData.buyerId,
        amount: escrowData.amount,
        fee: escrowData.fee || 0,
        fee_percentage: escrowData.feePercentage || 2.5,
        currency: escrowData.currency || 'USD',
        status: 'pending',
        is_released: false,
        approved_by_admin: false,
        terms: escrowData.terms || '',
        expiry_date: escrowData.expiryDate || null,
        dispute_reason: null,
        release_conditions: escrowData.releaseConditions || {}
      }])
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `)
      .single();
      
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('escrows')
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url, reputation_score),
        buyer:buyer_id(username, avatar_url, reputation_score),
        admin_approver:approved_by(username)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  }

  static async findByTradeId(tradeId) {
    const { data, error } = await supabase
      .from('escrows')
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `)
      .eq('trade_id', tradeId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async find(filters = {}) {
    let query = supabase
      .from('escrows')
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `);

    if (filters.sellerId) {
      query = query.eq('seller_id', filters.sellerId);
    }
    if (filters.buyerId) {
      query = query.eq('buyer_id', filters.buyerId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.isReleased !== undefined) {
      query = query.eq('is_released', filters.isReleased);
    }
    if (filters.approvedByAdmin !== undefined) {
      query = query.eq('approved_by_admin', filters.approvedByAdmin);
    }
    if (filters.tradeId) {
      query = query.eq('trade_id', filters.tradeId);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findOne(filters) {
    let query = supabase
      .from('escrows')
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `);

    if (filters.id) {
      query = query.eq('id', filters.id);
    }
    if (filters.tradeId) {
      query = query.eq('trade_id', filters.tradeId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateStatus(id, status, updatedBy = null) {
    const updateData = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'released') {
      updateData.is_released = true;
      updateData.released_at = new Date().toISOString();
      updateData.released_by = updatedBy;
    } else if (status === 'disputed') {
      updateData.disputed_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString();
      updateData.cancelled_by = updatedBy;
    }

    const { data, error } = await supabase
      .from('escrows')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async approveByAdmin(id, adminId, approved = true) {
    const { data, error } = await supabase
      .from('escrows')
      .update({ 
        approved_by_admin: approved,
        approved_by: adminId,
        approved_at: approved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async releaseEscrow(id, releasedBy, releaseNote = '') {
    const { data, error } = await supabase
      .from('escrows')
      .update({ 
        status: 'released',
        is_released: true,
        released_at: new Date().toISOString(),
        released_by: releasedBy,
        release_note: releaseNote,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async createDispute(id, disputedBy, disputeReason) {
    const { data, error } = await supabase
      .from('escrows')
      .update({ 
        status: 'disputed',
        disputed_at: new Date().toISOString(),
        disputed_by: disputedBy,
        dispute_reason: disputeReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async getUserEscrows(userId, type = 'all') {
    let query = supabase
      .from('escrows')
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `);

    if (type === 'selling') {
      query = query.eq('seller_id', userId);
    } else if (type === 'buying') {
      query = query.eq('buyer_id', userId);
    } else {
      query = query.or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getPendingEscrows() {
    const { data, error } = await supabase
      .from('escrows')
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `)
      .eq('status', 'pending')
      .eq('approved_by_admin', false)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data;
  }

  static async getDisputedEscrows() {
    const { data, error } = await supabase
      .from('escrows')
      .select(`
        *,
        trade:trade_id(*),
        seller:seller_id(username, avatar_url),
        buyer:buyer_id(username, avatar_url)
      `)
      .eq('status', 'disputed')
      .order('disputed_at', { ascending: true });
      
    if (error) throw error;
    return data;
  }

  static async getEscrowStats(userId = null) {
    let query = supabase
      .from('escrows')
      .select('status, amount, is_released');

    if (userId) {
      query = query.or(`seller_id.eq.${userId},buyer_id.eq.${userId}`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(e => e.status === 'pending').length,
      active: data.filter(e => e.status === 'active').length,
      released: data.filter(e => e.is_released).length,
      disputed: data.filter(e => e.status === 'disputed').length,
      totalAmount: data.reduce((sum, e) => sum + (e.amount || 0), 0),
      releasedAmount: data.filter(e => e.is_released).reduce((sum, e) => sum + (e.amount || 0), 0)
    };

    return stats;
  }

  static async cancelEscrow(id, cancelledBy, cancelReason = '') {
    const { data, error } = await supabase
      .from('escrows')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: cancelledBy,
        cancel_reason: cancelReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async updateReleaseConditions(id, conditions) {
    const { data, error } = await supabase
      .from('escrows')
      .update({ 
        release_conditions: conditions,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async checkExpiredEscrows() {
    const { data, error } = await supabase
      .from('escrows')
      .select('*')
      .eq('status', 'active')
      .not('expiry_date', 'is', null)
      .lt('expiry_date', new Date().toISOString());
      
    if (error) throw error;
    return data;
  }

  // Legacy compatibility methods
  static async save(escrowData) {
    if (escrowData.id) {
      const { data, error } = await supabase
        .from('escrows')
        .update({
          amount: escrowData.amount,
          fee: escrowData.fee,
          is_released: escrowData.isReleased,
          approved_by_admin: escrowData.approvedByAdmin,
          status: escrowData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', escrowData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      return await this.create(escrowData);
    }
  }

  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from('escrows')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

