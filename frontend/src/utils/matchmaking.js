const same = (left, right) => Boolean(left && right && String(left).toLowerCase() === String(right).toLowerCase());

const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== '';

export function profileCompletion(profile = {}) {
  const fields = ['name', 'email', 'age', 'height', 'city', 'religion', 'community', 'profession', 'education', 'income', 'bio', 'photo'];
  const filled = fields.filter((field) => hasValue(profile[field])).length;
  return Math.round((filled / fields.length) * 100);
}

export function calculateCompatibility(user = {}, profile = {}) {
  if (!profile?.id) return { score: 0, summary: 'Profile details are incomplete.' };

  const rules = [
    [same(user.religion, profile.religion), 18, 'same religion'],
    [same(user.community, profile.community), 12, 'shared community'],
    [same(user.city, profile.city), 14, 'same city'],
    [same(user.education, profile.education), 10, 'similar education'],
    [same(user.profession, profile.profession), 8, 'career alignment'],
    [Boolean(profile.verified), 12, 'verified profile'],
    [Boolean(profile.premium), 6, 'premium activity'],
    [Math.abs(Number(user.age || 0) - Number(profile.age || 0)) <= 4, 12, 'comfortable age range'],
    [profileCompletion(profile) >= 75, 8, 'complete profile']
  ];

  const earned = rules.reduce((total, [passed, points]) => total + (passed ? points : 0), 18);
  const score = Math.max(45, Math.min(99, earned));
  const reasons = rules.filter(([passed]) => passed).slice(0, 3).map(([, , label]) => label);

  return {
    score,
    summary: reasons.length ? `Strong because of ${reasons.join(', ')}.` : 'Basic compatibility based on available profile details.'
  };
}

export function calculateFraudRisk(profile = {}) {
  let risk = 0;
  const flags = [];

  if (!profile.verified) {
    risk += 24;
    flags.push('not verified');
  }
  if (profileCompletion(profile) < 55) {
    risk += 22;
    flags.push('low profile completion');
  }
  if (!hasValue(profile.photo)) {
    risk += 18;
    flags.push('no profile photo');
  }
  if (!hasValue(profile.bio) || String(profile.bio).length < 35) {
    risk += 12;
    flags.push('short bio');
  }
  if (String(profile.status || '').toLowerCase() === 'pending') {
    risk += 16;
    flags.push('pending approval');
  }

  return {
    score: Math.min(100, risk),
    level: risk >= 55 ? 'High' : risk >= 30 ? 'Medium' : 'Low',
    flags
  };
}
