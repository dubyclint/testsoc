let trustCriteria = {
  priority: [
    'postsPerWeek>=12',
    'isPremium',
    'pewGiftBalance>=10',
    'sameRegion',
    'hasPaidActivity',
    'tierOneCountry'
  ],
  general: [
    'isVerified',
    'kycVerified',
    'hasRealProfilePic',
    'isActive'
  ]
}

export function setTrustCriteria(newCriteria) {
  trustCriteria = newCriteria
}

export function getTrustCriteria() {
  return trustCriteria
}

export function evaluateTrust(user) {
  const met = []

  if (user.isVerified) met.push('isVerified')
  if (user.kycVerified) met.push('kycVerified')
  if (user.profilePic?.isReal) met.push('hasRealProfilePic')
  if (user.lastActive && Date.now() - user.lastActive < 7 * 86400000) met.push('isActive')

  if ((user.postsPerWeek || 0) >= 12) met.push('postsPerWeek>=12')
  if (user.isPremium) met.push('isPremium')
  if ((user.pewGiftBalance || 0) >= 10) met.push('pewGiftBalance>=10')
  if (user.hasPaidActivity) met.push('hasPaidActivity')
  if (user.region === user.country) met.push('sameRegion')
  if (['USA', 'Canada', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Germany', 'France', 'Japan'].includes(user.country)) {
    met.push('tierOneCountry')
  }

  const priorityMet = met.filter(c => trustCriteria.priority.includes(c)).length
  const priorityRatio = priorityMet / trustCriteria.priority.length

  return {
    isTrusted: priorityRatio >= 0.5,
    criteriaMet: met,
    priorityRatio
  }
}
