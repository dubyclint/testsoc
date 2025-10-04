// controllers/universeController.js - Universe Message Controller for Supabase/PostgreSQL
import { supabase } from '../utils/supabase.js';

export class UniverseController {
  // Send message to universe chat
  static async sendUniverseMessage(req, res) {
    try {
      const {
        sender_id,
        content,
        message_type,
        media_url,
        reply_to_id,
        location,
        is_anonymous
      } = req.body;

      const { data: message, error } = await supabase
        .from('universe_messages')
        .insert({
          sender_id,
          content,
          message_type: message_type || 'text',
          media_url,
          reply_to_id,
          location,
          is_anonymous: is_anonymous || false,
          status: 'sent',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Universe message sent successfully',
        data: message
      });
    } catch (error) {
      console.error('Error sending universe message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get universe messages (global chat)
  static async getUniverseMessages(req, res) {
    try {
      const { page = 1, limit = 50, message_type, location } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('universe_messages')
        .select(`
          *,
          sender:users!universe_messages_sender_id_fkey(id, username, avatar_url, verified_badge),
          reply_to:universe_messages!universe_messages_reply_to_id_fkey(
            id, content, sender_id,
            sender:users!universe_messages_sender_id_fkey(username)
          ),
          reactions:universe_message_reactions(reaction_type, count)
        `)
        .eq('status', 'sent')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (message_type) {
        query = query.eq('message_type', message_type);
      }

      if (location) {
        query = query.eq('location', location);
      }

      const { data: messages, error } = await query;

      if (error) throw error;

      // Hide sender info for anonymous messages
      const processedMessages = messages.map(msg => ({
        ...msg,
        sender: msg.is_anonymous ? null : msg.sender
      }));

      return res.status(200).json({
        success: true,
        data: processedMessages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching universe messages:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get trending universe messages
  static async getTrendingMessages(req, res) {
    try {
      const { hours = 24, limit = 20 } = req.query;
      const timeLimit = new Date(Date.

