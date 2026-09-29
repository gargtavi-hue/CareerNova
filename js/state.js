/* CareerNova - Shared Application State */

export const state = {
  currentScore: 0,
  solvedDsaCount: 0,
  solvedDsaMap: {},
  dsaStreak: 1,
  savedJobIds: new Set(),
  registeredHackathonIds: new Set(),
  registeredHackathonTeams: {},
  currentUser: {
    name: 'Alex Wright',
    email: 'alex.wright@university.edu',
    college: 'Stanford University',
    branch: 'Computer Science & Engineering',
    year: '2026',
    role: 'Student'
  }
};

// Initialize registered hackathons from localStorage if available
try {
  const savedRegs = localStorage.getItem('careernova_registered_hackathons');
  if (savedRegs) {
    const parsed = JSON.parse(savedRegs);
    if (Array.isArray(parsed)) {
      parsed.forEach(id => state.registeredHackathonIds.add(id));
    }
  }
} catch(e) {}

export function setScore(newScore) {
  state.currentScore = Math.min(100, Math.max(0, newScore));
  return state.currentScore;
}

export function markDsaSolved(id) {
  if (!state.solvedDsaMap[id]) {
    state.solvedDsaMap[id] = true;
    state.solvedDsaCount++;
    return true;
  }
  return false;
}

export function unmarkDsaSolved(id) {
  if (state.solvedDsaMap[id]) {
    delete state.solvedDsaMap[id];
    state.solvedDsaCount = Math.max(0, state.solvedDsaCount - 1);
    return true;
  }
  return false;
}

export function toggleJobSaved(jobId) {
  if (state.savedJobIds.has(jobId)) {
    state.savedJobIds.delete(jobId);
    return false;
  } else {
    state.savedJobIds.add(jobId);
    return true;
  }
}

export function registerHackathonState(id, teamInfo = {}) {
  state.registeredHackathonIds.add(id);
  state.registeredHackathonTeams[id] = teamInfo;
  try {
    localStorage.setItem('careernova_registered_hackathons', JSON.stringify([...state.registeredHackathonIds]));
  } catch(e) {}
  return true;
}

export function unregisterHackathonState(id) {
  state.registeredHackathonIds.delete(id);
  delete state.registeredHackathonTeams[id];
  try {
    localStorage.setItem('careernova_registered_hackathons', JSON.stringify([...state.registeredHackathonIds]));
  } catch(e) {}
  return true;
}

export function isHackathonRegistered(id) {
  return state.registeredHackathonIds.has(id);
}
