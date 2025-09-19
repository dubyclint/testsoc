const io = req.app.get('io')
io.emit('escrow:update', { dealId, action: 'released' }) // or 'refunded' or 'created'
io.emit('escrow:userUpdate', {
  dealId,
  action: 'released', // or 'refunded', 'created'
  userId: buyerId // or sellerId depending on context
})
