import { serverSupabaseClient } from '#supabase/server'

interface SignupRequest {
  email: string
  password: string
  username: string
  interests: string[]
  profile?: {
    bio?: string
    avatar_url?: string
  }
}

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event)
    const body = await readBody<SignupRequest>(event)
    
    // Validate required fields
    if (!body.email || !body.password || !body.username) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, password, and username are required'
      })
    }
    
    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', body.username)
      .single()
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username already taken'
      })
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password
    })
    
    if (authError) {
      throw createError({
        statusCode: 400,
        statusMessage: authError.message,
        data: authError
      })
    }
    
    if (!authData.user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create user'
      })
    }
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: body.username,
        email: body.email,
        bio: body.profile?.bio || '',
        avatar_url: body.profile?.avatar_url || null,
        created_at: new Date().toISOString()
      })
    
    if (profileError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create profile',
        data: profileError
      })
    }
    
    // Add user interests
    if (body.interests && body.interests.length > 0) {
      const userInterests = body.interests.map(interestId => ({
        user_id: authData.user.id,
        interest_id: interestId,
        created_at: new Date().toISOString()
      }))
      
      const { error: interestsError } = await supabase
        .from('user_interests')
        .insert(userInterests)
      
      if (interestsError) {
        console.error('Failed to add user interests:', interestsError)
        // Don't fail the signup if interests fail to save
      }
    }
    
    return {
      success: true,
      data: {
        user: authData.user,
        session: authData.session
      },
      message: 'Account created successfully'
    }
    
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during signup',
      data: error
    })
  }
})
