// server/api/controllers/escrowController.js
import { supabase } from '../../../utils/supabase.js';

export class EscrowController {
  // Create escrow deal
  static async createEscrow(req, res) {
    try {
      const {
        buyer_id,
        seller_id,
        trade_id,
        amount,
        currency,
        terms,
        auto_release_hours,
        description
      } = req.body;

      if (buyer_id === seller_id) {
        return res.status(400).json({ error: 'Buyer and seller cannot be the same user' });
      }

      // Verify buyer has sufficient balance
      const { data: buyerWallet, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', buyer_id)
        .eq('currency_code', currency)
        .single();

      if (walletError) throw walletError;

      if (parseFloat(buyerWallet.balance) < parseFloat(amount)) {
        return res.status(400).json({ error: 'Insufficient balance to create escrow' });
      }

      // Lock funds in buyer's wallet
      await supabase
        .from('wallets')
        .update({
          balance: parseFloat(buyerWallet.balance) - parseFloat(amount),
          locked_balance: parseFloat(buyerWallet.locked_balance || 0) + parseFloat(amount),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', buyer_id)
        .eq('currency_code', currency);

      const autoReleaseTime = auto_release_hours 
        ? new Date(Date.now() + auto_release_hours * 60 * 60 * 1000).toISOString()
        : null;

      const { data: escrow, error } = await supabase
        .from('escrows')
        .insert({
          buyer_id,
          seller_id,
          trade_id,
          amount,
          currency,
          terms,
          auto_release_at: autoReleaseTime,
          description,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Notify seller
      await supabase
        .from('notifications')
        .insert({
          user_id: seller_id,
          type: 'escrow_created',
          title: 'New Escrow Created',
          message: `You have received a new escrow request for ${amount} ${currency}`,
          created_at: new Date().toISOString()
        });

      res.status(201).json({
        success: true,
        message: 'Escrow created successfully',
        escrow
      });

    } catch (error) {
      console.error('Create escrow error:', error);
      res.status(500).json({ error: 'Failed to create escrow' });
    }
  }

  // Add other methods here...
}
