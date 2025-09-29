import express from 'express'
const router = express.Router()

router.post('/signup', handleSignup)
router.post('/signin', handleSignin)
router.post('/recover', handleRecovery)
router.get('/verify/:token', handleVerification)

export default router
