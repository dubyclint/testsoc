const io = req.app.get('io')
io.emit('escrow:update', { dealId, action: 'released' }) // or 'refunded' or 'created'
