// models/adAnalytics.js - Supabase PostgreSQL Ad Analytics Model
import { supabase } from '../utils/supabase.js';

export class AdAnalytics {
  static async createCampaign(campaignData) {
    const { data, error } = await supabase
      .from('ad_analytics')
      .insert([{
        ad_id: campaignData.adId,
        advertiser_id: campaignData.advertiserId,
        ad_type: campaignData.adType,
        placement: campaignData.placement,
        campaign_id: campaignData.campaignId,
        target_audience: campaignData.targetAudience || {},
        spend_currency: campaignData.spendCurrency || 'USD',
        start_date: campaignData.startDate,
        end_date: campaignData.endDate
      }])
      .select(`
        *,
        advertiser:advertiser_id(username, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async recordImpression(adId) {
    const { data, error } = await supabase
      .rpc('increment_ad_impressions', { ad_analytics_id: adId });

    if (error) throw error;
    return data;
  }

  static async recordClick(adId) {
    const { data, error } = await supabase
      .rpc('increment_ad_clicks', { ad_analytics_id: adId });

    if (error) throw error;
    
    // Update CTR after recording click
    await this.updateCTR(adId);
    return data;
  }

  static async recordConversion(adId, conversionValue = null) {
    const { data, error } = await supabase
      .rpc('increment_ad_conversions', { 
        ad_analytics_id: adId,
        conversion_value: conversionValue 
      });

    if (error) throw error;
    
    // Update conversion rate after recording conversion
    await this.updateConversionRate(adId);
    return data;
  }

  static async updateCTR(adId) {
    const { data: analytics } = await supabase
      .from('ad_analytics')
      .select('impressions, clicks')
      .eq('id', adId)
      .single();

    if (analytics && analytics.impressions > 0) {
      const ctr = (analytics.clicks / analytics.impressions) * 100;
      
      const { error } = await supabase
        .from('ad_analytics')
        .update({ ctr: ctr.toFixed(4) })
        .eq('id', adId);

      if (error) throw error;
    }
  }

  static async updateConversionRate(adId) {
    const { data: analytics } = await supabase
      .from('ad_analytics')
      .select('clicks, conversions')
      .eq('id', adId)
      .single();

    if (analytics && analytics.clicks > 0) {
      const conversionRate = (analytics.conversions / analytics.clicks) * 100;
      
      const { error } = await supabase
        .from('ad_analytics')
        .update({ conversion_rate: conversionRate.toFixed(4) })
        .eq('id', adId);

      if (error) throw error;
    }
  }

  static async getCampaignAnalytics(campaignId) {
    const { data, error } = await supabase
      .from('ad_analytics')
      .select(`
        *,
        advertiser:advertiser_id(username, avatar_url)
      `)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAdvertiserAnalytics(advertiserId) {
    const { data, error } = await supabase
      .from('ad_analytics')
      .select('*')
      .eq('advertiser_id', advertiserId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate aggregated statistics
    const totalSpend = data.reduce((sum, ad) => sum + (ad.spend_amount || 0), 0);
    const totalImpressions = data.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    const totalClicks = data.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const totalConversions = data.reduce((sum, ad) => sum + (ad.conversions || 0), 0);

    return {
      campaigns: data,
      summary: {
        total_spend: totalSpend,
        total_impressions: totalImpressions,
        total_clicks: totalClicks,
        total_conversions: totalConversions,
        average_ctr: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0,
        average_conversion_rate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0
      }
    };
  }

  static async getTopPerformingAds(limit = 10, metric = 'ctr') {
    const { data, error } = await supabase
      .from('ad_analytics')
      .select(`
        *,
        advertiser:advertiser_id(username, avatar_url)
