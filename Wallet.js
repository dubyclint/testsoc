// Wallet.js - Supabase PostgreSQL Model
import { supabase } from './utils/supabase.js';

export class Wallet {
  static async create(walletData) {
    const currencies = ['USDT', 'USDC', 'BTC', 'ETH', 'SOL', 'MATIC', 'XAUT'];
    
    const walletInserts = currencies.map(currency => ({
      user_id: walletData.userId,
      currency_code: currency,
      currency_name: this.getCurrencyName(currency),
      balance: 0.00,
      locked_balance: 0.00,
      wallet_address: `${currency.toLowerCase()}_${walletData.userId}`,
      wallet_type: 'internal'
    }));

    const { data, error } = await supabase
      .from('wallets')
      .insert(walletInserts)
      .select();

    if (error) throw error;
    return data;
  }

  static getCurrencyName(code) {
    const names = {
      'USDT': 'Tether',
      'USDC': 'USD Coin',
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'SOL': 'Solana',
      'MATIC': 'Polygon',
      'XAUT': 'Tether Gold'
    };
    return names[code] || code;
  }

  static async findOne(filter) {
    let query = supabase.from('wallets').select('*');
    
    if (filter.userId) {
      query = query.eq('user_id', filter.userId);
    }
    if (filter.currency_code) {
      query = query.eq('currency_code', filter.currency_code);
    }

    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async find(filter = {}) {
    let query = supabase.from('wallets').select('*');
    
    if (filter.userId) {
      query = query.eq('user_id', filter.userId);
    }
    if (filter.user_id) {
      query = query.eq('user_id', filter.user_id);
    }

    query = query.order('currency_code');

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async save(walletData) {
    if (walletData.id) {
      // Update existing
      const { data, error } = await supabase
        .from('wallets')
        .update({
          balance: walletData.balance,
          locked_balance: walletData.locked_balance,
          wallet_address: walletData.wallet_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', walletData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new
      return await this.create(walletData);
    }
  }

  static async updateBalance(userId, currencyCode, newBalance, lockedBalance = null) {
    const updateData = { 
      balance: newBalance,
      updated_at: new Date().toISOString()
    };
    
    if (lockedBalance !== null) {
      updateData.locked_balance = lockedBalance;
    }

    const { data, error } = await supabase
      .from('wallets')
      .update(updateData)
      .eq('user_id', userId)
      .eq('currency_code', currencyCode)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserWallets(userId) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('currency_code');

    if (error) throw error;
    return data;
  }

  // Legacy compatibility methods
  static async findById(id) {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByIdAndUpdate(id, updateData) {
    const { data, error } = await supabase
      .from('wallets')
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
