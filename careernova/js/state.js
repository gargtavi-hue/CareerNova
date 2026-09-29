/* CareerNova - Shared Application State */

export const state = {
  currentScore: 0,
  solvedDsaCount: 0,
  solvedDsaMap: {},
  dsaStreak: 1,
  savedJobIds: new Set(),
  currentUser: {
    name: 'Alex Wright',
    email: 'alex.wright@university.edu',
    college: 'Stanford University',
    branch: 'Computer Science & Engineering',
    year: '2026',
    role: 'Student'
  }
};

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
