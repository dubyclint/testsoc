// controllers/newController.js - New User/Content Controller for Supabase/PostgreSQL
import { supabase } from '../utils/supabase.js';
import { Wallet } from '../models/wallet.js';

export class NewController {
  // Create new user profile (complete onboarding)
  static async createUserProfile(req, res) {
    try {
      const {
        user_id,
        username,
        full_name,
        bio,
        location,
        date_of_birth,
        interests,
        profile_image,
        privacy_settings
      } = req.body;

      // Check if username is available
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Update user profile
      const { data: user, error: userError } = await supabase
        .from('users')
        .update({
          username,
          full_name,
          bio,
          location,
          date_of_birth,
          interests,
          profile_image,
          privacy_settings,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user_id)
        .select()
        .single();

      if (userError) throw userError;

      // Create user wallets
      await Wallet.createUserWallets(user_id);

      // Create user settings
      await supabase
        .from('user_settings')
        .insert({
          user_id,
          language: 'en',
          timezone: 'UTC',
          email_notifications: true,
          push_notifications: true,
          privacy_level: 'public',
          is_available_for_matches: true,
          preferred_activities: [],
          created_at: new Date().toISOString()
        });

      // Create P2P profile
      await supabase
        .from('p2p_profiles')
        .insert({
          user_id,
          display_name: full_name || username,
          verification_level: 'basic',
          reputation_score: 0,
          total_trades: 0,
          completion_rate: 0,
          is_active: false,
          created_at: new Date().toISOString()
        });

      // Send welcome notification
      await supabase
        .from('notifications')
        .insert({
          user_id,
          type: 'welcome',
          title: 'Welcome to SocialVerse!',
          message: 'Your profile has been created successfully. Start exploring!',
          is_read: false,
          created_at: new Date().toISOString()
        });

      return res.status(201).json({
        success: true,
        message: 'User profile created successfully',
        data: user
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Quick post creation for new users
  static async createWelcomePost(req, res) {
    try {
      const { user_id, content } = req.body;

      const welcomeContent = content || "Just joined SocialVerse! Excited to connect and trade! 🚀";

      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          user_id,
          content: welcomeContent,
          post_type: 'text',
          visibility: 'public',
          tags: ['welcome', 'newuser'],
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Welcome post created successfully',
        data: post
      });
    } catch (error) {
      console.error('Error creating welcome post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Initialize new features for existing users
  static async initializeNewFeatures(req, res) {
    try {
      const { user_id, features } = req.body;

      const results = {};

      for (const feature of features) {
        switch (feature) {
          case 'p2p_profile':
            const { data: p2pProfile, error: p2pError } = await supabase
              .from('p2p_profiles')
              .insert({
                user_id,
                verification_level: 'basic',
                reputation_score: 0,
                total_trades: 0,
                completion_rate: 0,
                is_active: false,
                created_at: new Date().toISOString()
              })
              .select()
              .single();
            
            results.p2p_profile = p2pError ? { error: p2pError.message } : p2pProfile;
            break;

          case 'notification_preferences':
            const { data: notifPrefs, error: notifError } = await supabase
              .from('notification_preferences')
              .insert({
                user_id,
                pew_notifications: true,
                gift_notifications: true,
                trade_notifications: true,
                pal_requests: true,
                post_interactions: true,
                email_notifications: false,
                push_notifications: true,
                created_at: new Date().toISOString()
              })
              .select()
              .single();
            
            results.notification_preferences = notifError ? { error: notifError.message } : notifPrefs;
            break;

          case 'user_settings':
            const { data: settings, error: settingsError } = await supabase
              .from('user_settings')
              .insert({
                user_id,
                language: 'en',
                timezone: 'UTC',
                privacy_level: 'public',
                is_available_for_matches: true,
                preferred_activities: [],
                created_at: new Date().toISOString()
              })
              .select()
              .single();
            
            results.user_settings = settingsError ? { error: settingsError.message } : settings;
            break;

          default:
            results[feature] = { error: 'Unknown feature' };
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Features initialized',
        data: results
      });
    } catch (error) {
      console.error('Error initializing new features:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get onboarding progress
  static async getOnboardingProgress(req, res) {
    try {
      const { userId } = req.params;

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('username, full_name, bio, profile_image, profile_completed')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { data: wallets, error: walletError } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', userId);

      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      const { data: p2pProfile, error: p2pError } = await supabase
        .from('p2p_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      const progress = {
        profile_basic: !!(user.username && user.full_name),
        profile_image: !!user.profile_image,
        bio_completed: !!user.bio,
        wallets_created: wallets && wallets.length > 0,
        settings_configured: !!settings,
        p2p_profile_created: !!p2pProfile,
        profile_completed: user.profile_completed
      };

      const completedSteps = Object.values(progress).filter(Boolean).length;
      const totalSteps = Object.keys(progress).length;
      const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

      return res.status(200).json({
        success: true,
        data: {
          progress,
          completion_percentage: completionPercentage,
          completed_steps: completedSteps,
          total_steps: totalSteps
        }
      });
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create sample content for new users
  static async createSampleContent(req, res) {
    try {
      const { user_id } = req.body;

      const samplePosts = [
        {
          content: "New to crypto trading! Any tips for beginners? 🤔",
          post_type: "text",
          tags: ["crypto", "beginner", "help"]
        },
        {
          content: "Looking for trading partners in my area. Let's connect! 🤝",
          post_type: "text", 
          tags: ["trading", "network", "local"]
        }
      ];

      const createdPosts = [];
      for (const postData of samplePosts) {
        const { data: post, error } = await supabase
          .from('posts')
          .insert({
            user_id,
            ...postData,
            visibility: 'public',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error) {
          createdPosts.push(post);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Sample content created successfully',
        data: { posts_created: createdPosts.length }
      });
    } catch (error) {
      console.error('Error creating sample content:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Suggest connections for new users
  static async suggestConnections(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 10 } = req.query;

      // Get users with similar interests or location
      const { data: currentUser, error: userError } = await supabase
        .from('users')
        .select('interests, location')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      let query = supabase
        .from('users')
        .select('id, username, full_name, avatar_url, location, interests')
        .neq('id', userId)
        .eq('profile_completed', true)
        .limit(limit);

      // Filter by location if available
      if (currentUser.location) {
        query = query.eq('location', currentUser.location);
      }

      const { data: suggestedUsers, error } = await query;

      if (error) throw error;

      // Score users based on common interests
      const scoredUsers = suggestedUsers.map(user => {
        let score = 0;
        
        if (user.location === currentUser.location) score += 3;
        
        if (currentUser.interests && user.interests) {
          const commonInterests = currentUser.interests.filter(interest => 
            user.interests.includes(interest)
          );
          score += commonInterests.length * 2;
        }
        
        return { ...user, compatibility_score: score };
      });

      // Sort by score and return top suggestions
      const sortedSuggestions = scoredUsers
        .sort((a, b) => b.compatibility_score - a.compatibility_score)
        .slice(0, limit);

      return res.status(200).json({
        success: true,
        data: sortedSuggestions
      });
    } catch (error) {
      console.error('Error suggesting connections:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
