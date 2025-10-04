// server/api/controllers/newController.js - New User/Content Controller for Supabase/PostgreSQL
import { supabase } from '../../../utils/supabase.js';

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
      const currencies = [
        { code: 'USDT', name: 'Tether' },
        { code: 'USDC', name: 'USD Coin' },
        { code: 'BTC', name: 'Bitcoin' },
        { code: 'ETH', name: 'Ethereum' },
        { code: 'SOL', name: 'Solana' },
        { code: 'MATIC', name: 'Polygon' },
        { code: 'XAUT', name: 'Tether Gold' }
      ];

      const walletInserts = currencies.map(currency => ({
        user_id,
        currency_code: currency.code,
        currency_name: currency.name,
        balance: 0.00,
        locked_balance: 0.00,
        wallet_address: `${currency.code.toLowerCase()}_${user_id}`,
        wallet_type: 'internal',
        created_at: new Date().toISOString()
      }));

      await supabase
        .from('wallets')
        .insert(walletInserts);

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

      // Create notification preferences
      await supabase
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
        });

      // Send welcome notification
      await supabase
        .from('notifications')
        .insert({
          user_id,
          type: 'welcome',
          title: 'Welcome to SocialVerse!',
          message: 'Your profile has been created successfully. Start exploring and connect with traders!',
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

      const welcomeContent = content || "Just joined SocialVerse! Excited to connect and trade with everyone! 🚀💰";

      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          user_id,
          content: welcomeContent,
          post_type: 'text',
          visibility: 'public',
          tags: ['welcome', 'newuser', 'trading'],
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
            try {
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
            } catch (err) {
              results.p2p_profile = { error: err.message };
            }
            break;

          case 'notification_preferences':
            try {
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
            } catch (err) {
              results.notification_preferences = { error: err.message };
            }
            break;

          case 'user_settings':
            try {
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
            } catch (err) {
              results.user_settings = { error: err.message };
            }
            break;

          case 'wallets':
            try {
              const currencies = [
                { code: 'USDT', name: 'Tether' },
                { code: 'USDC', name: 'USD Coin' },
                { code: 'BTC', name: 'Bitcoin' },
                { code: 'ETH', name: 'Ethereum' }
              ];

              const walletInserts = currencies.map(currency => ({
                user_id,
                currency_code: currency.code,
                currency_name: currency.name,
                balance: 0.00,
                locked_balance: 0.00,
                wallet_address: `${currency.code.toLowerCase()}_${user_id}`,
                wallet_type: 'internal',
                created_at: new Date().toISOString()
              }));

              const { data: wallets, error: walletError } = await supabase
                .from('wallets')
                .insert(walletInserts)
                .select();

              results.wallets = walletError ? { error: walletError.message } : wallets;
            } catch (err) {
              results.wallets = { error: err.message };
            }
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

      const { data: notifPrefs, error: notifError } = await supabase
        .from('notification_preferences')
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
        notification_preferences_set: !!notifPrefs,
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
          total_steps: totalSteps,
          next_steps: getNextSteps(progress)
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
          content: "New to crypto trading! Any tips for beginners? Looking to learn from experienced traders 🤔📚",
          post_type: "text",
          tags: ["crypto", "beginner", "help", "learning"]
        },
        {
          content: "Looking for trading partners in my area. Let's connect and share strategies! 🤝💼",
          post_type: "text", 
          tags: ["trading", "network", "local", "partnership"]
        },
        {
          content: "Just set up my first wallet on SocialVerse! Ready to start my trading journey 🚀💰",
          post_type: "text",
          tags: ["milestone", "wallet", "journey", "excited"]
        }
      ];

      const createdPosts = [];
      for (const postData of samplePosts) {
        try {
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
        } catch (err) {
          console.error('Error creating sample post:', err);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Sample content created successfully',
        data: { 
          posts_created: createdPosts.length,
          posts: createdPosts
        }
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

      // Get current user's interests and location
      const { data: currentUser, error: userError } = await supabase
        .from('users')
        .select('interests, location')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      let query = supabase
        .from('users')
        .select('id, username, full_name, avatar_url, location, interests, created_at')
        .neq('id', userId)
        .eq('profile_completed', true)
        .limit(parseInt(limit) * 2); // Get more to filter and score

      const { data: potentialConnections, error } = await query;

      if (error) throw error;

      // Score users based on compatibility
      const scoredUsers = potentialConnections.map(user => {
        let score = 0;
        
        // Location match (highest priority)
        if (user.location && currentUser.location && user.location === currentUser.location) {
          score += 5;
        }
        
        // Common interests
        if (currentUser.interests && user.interests) {
          const commonInterests = currentUser.interests.filter(interest => 
            user.interests.includes(interest)
          );
          score += commonInterests.length * 2;
        }
        
        // Recent join date (prefer active new users)
        const userJoinDate = new Date(user.created_at);
        const daysSinceJoin = (Date.now() - userJoinDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceJoin < 30) score += 1; // Bonus for users who joined recently
        
        return { 
          ...user, 
          compatibility_score: score,
          common_interests: currentUser.interests && user.interests 
            ? currentUser.interests.filter(interest => user.interests.includes(interest))
            : []
        };
      });

      // Sort by score and return top suggestions
      const sortedSuggestions = scoredUsers
        .sort((a, b) => b.compatibility_score - a.compatibility_score)
        .slice(0, parseInt(limit));

      return res.status(200).json({
        success: true,
        data: sortedSuggestions
      });
    } catch (error) {
      console.error('Error suggesting connections:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get new user statistics
  static async getNewUserStats(req, res) {
    try {
      const { userId } = req.params;

      // Get user registration date
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('created_at')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const joinDate = new Date(user.created_at);
      const daysSinceJoin = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

      // Get user's activity stats
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', userId);

      const { data: pews, error: pewsError } = await supabase
        .from('pews')
        .select('id')
        .eq('sender_id', userId);

      const { data: pals, error: palsError } = await supabase
        .from('pals')
        .select('id')
        .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
        .eq('status', 'accepted');

      const { data: trades, error: tradesError } = await supabase
        .from('trades')
        .select('id')
        .eq('user_id', userId);

      const stats = {
        days_since_join: daysSinceJoin,
        join_date: joinDate.toISOString(),
        posts_created: posts ? posts.length : 0,
        pews_sent: pews ? pews.length : 0,
        pals_connected: pals ? pals.length : 0,
        trades_created: trades ? trades.length : 0,
        activity_level: calculateActivityLevel(daysSinceJoin, {
          posts: posts ? posts.length : 0,
          pews: pews ? pews.length : 0,
          pals: pals ? pals.length : 0,
          trades: trades ? trades.length : 0
        })
      };

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching new user stats:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Send onboarding reminder
  static async sendOnboardingReminder(req, res) {
    try {
      const { user_id } = req.body;

      // Check onboarding progress
      const { userId } = { userId: user_id };
      const progressResponse = await NewController.getOnboardingProgress({ params: { userId } }, {
        status: () => ({ json: (data) => data })
      });

      const progress = progressResponse.data;
      
      if (progress.completion_percentage === 100) {
        return res.status(200).json({
          success: true,
          message: 'User has already completed onboarding'
        });
      }

      // Create reminder notification
      const nextStep = progress.next_steps[0];
      await supabase
        .from('notifications')
        .insert({
          user_id,
          type: 'onboarding_reminder',
          title: 'Complete Your Profile Setup',
          message: `You're ${progress.completion_percentage}% done! Next step: ${nextStep}`,
          is_read: false,
          created_at: new Date().toISOString()
        });

      return res.status(201).json({
        success: true,
        message: 'Onboarding reminder sent successfully',
        data: {
          completion_percentage: progress.completion_percentage,
          next_step: nextStep
        }
      });
    } catch (error) {
      console.error('Error sending onboarding reminder:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Helper function to determine next steps
function getNextSteps(progress) {
  const steps = [];
  
  if (!progress.profile_basic) steps.push("Complete basic profile info");
  if (!progress.profile_image) steps.push("Upload profile image");
  if (!progress.bio_completed) steps.push("Add bio description");
  if (!progress.wallets_created) steps.push("Set up crypto wallets");
  if (!progress.settings_configured) steps.push("Configure account settings");
  if (!progress.p2p_profile_created) steps.push("Create P2P trading profile");
  if (!progress.notification_preferences_set) steps.push("Set notification preferences");
  
  return steps.length > 0 ? steps : ["Start exploring and connecting!"];
}

// Helper function to calculate activity level
function calculateActivityLevel(daysSinceJoin, activities) {
  const totalActivities = Object.values(activities).reduce((sum, count) => sum + count, 0);
  const avgActivitiesPerDay = daysSinceJoin > 0 ? totalActivities / daysSinceJoin : totalActivities;
  
  if (avgActivitiesPerDay >= 2) return 'Very Active';
  if (avgActivitiesPerDay >= 1) return 'Active';
  if (avgActivitiesPerDay >= 0.5) return 'Moderate';
  if (totalActivities > 0) return 'Getting Started';
  return 'Inactive';
}
