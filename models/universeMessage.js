// models/universeMessage.js - Supabase PostgreSQL Universe Message Model
import { supabase } from '../utils/supabase.js';

export class UniverseMessage {
  static async create(messageData) {
    const { data, error } = await supabase
      .from('universe_messages')
      .insert([{
        user_id: messageData.userId,
        channel_type: messageData.channelType,
        channel_id: messageData.channelId,
        message: messageData.message,
        media_urls: messageData.mediaUrls || [],
        mentions: messageData.mentions || [],
        reply_to: messageData.replyTo
      }])
      .select(`
        *,
        profiles:user_id(username, avatar_url, is_verified),
        reply_to_message:reply_to(id, message, profiles:user_id(username))
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getChannelMessages(channelType, channelId, limit = 50, before = null) {
    let query = supabase
      .from('universe_messages')
      .select(`
        *,
        profiles:user_id(username, avatar_url, is_verified),
        reply_to_message:reply_to(id, message, profiles:user_id(username))
      `)
      .eq('channel_type', channelType)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data.reverse(); // Return in chronological order
  }

  static async getCountryChannels() {
    const { data, error } = await supabase
      .from('universe_messages')
      .select('channel_id, count(*)')
      .eq('channel_type', 'country')
      .group('channel_id')
      .order('count', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getInterestChannels() {
    const { data, error } = await supabase
      .from('universe_messages')
      .select('channel_id, count(*)')
      .eq('channel_type', 'interest')
      .group('channel_id')
      .order('count', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async pinMessage(messageId, userId) {
    // Only admins/moderators should be able to pin messages
    const { data, error } = await supabase
      .from('universe_messages')
      .update({ is_pinned: true })
      .eq('id', messageId)
      .select(`
        *,
        profiles:user_id(username, avatar_url, is_verified)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async addReaction(messageId, userId, emoji) {
    // Get current reactions
    const { data: message } = await supabase
      .from('universe_messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    const reactions = message.reactions || {};
    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }

    // Add user to reaction if not already there
    if (!reactions[emoji].includes(userId)) {
      reactions[emoji].push(userId);
    }

    const { data, error } = await supabase
      .from('universe_messages')
      .update({ reactions })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeReaction(messageId, userId, emoji) {
    // Get current reactions
    const { data: message } = await supabase
      .from('universe_messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    const reactions = message.reactions || {};
    if (reactions[emoji]) {
      reactions[emoji] = reactions[emoji].filter(id => id !== userId);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    }

    const { data, error } = await supabase
      .from('universe_messages')
      .update({ reactions })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async searchMessages(query, channelType = null, channelId = null) {
    let searchQuery = supabase
      .from('universe_messages')
      .select(`
        *,
        profiles:user_id(
