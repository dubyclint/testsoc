// server/api/posts/index.get.js - Optimized with dynamic imports
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  const req = { query }
  const res = {
    status: (code) => ({ json: (data) => ({ statusCode: code, ...data }) }),
    json: (data) => data
  }

  try {
    // Dynamic import to reduce initial bundle size
    const { PostController } = await import('../../controllers/postController')
    return await PostController.getPosts(req, res)
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
