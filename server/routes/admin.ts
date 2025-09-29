import express from 'express'
const router = express.Router()

router.post('/admin/login', handleAdminLogin)
router.get('/admin/dashboard', requireAdminAuth, showDashboard)

export default router
