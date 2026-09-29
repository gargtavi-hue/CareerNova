/* CareerNova - Authentication & Onboarding Module */

import { state } from '../state.js';
import { updateGaugeVisual } from './dashboard.js';
import { switchView } from './navigation.js';
import { showToast } from './toast.js';

export function handleAuthSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();

  const name = document.getElementById('auth-name')?.value?.trim() || 'Alex Wright';
  const email = document.getElementById('auth-email')?.value?.trim() || 'alex.wright@university.edu';
  const college = document.getElementById('auth-college')?.value?.trim() || 'Stanford University';
  const branch = document.getElementById('auth-branch')?.value || 'Computer Science & Engineering';
  const year = document.getElementById('auth-year')?.value || '2026';

  state.currentUser = {
    name,
    email,
    college,
    branch,
    year,
    role: 'Student'
  };

  const nameEl = document.getElementById('sidebar-user-name');
  if (nameEl) nameEl.innerText = name;

  const roleEl = document.getElementById('sidebar-user-role');
  if (roleEl) roleEl.innerText = `${college.split(' ')[0]} • ${year}`;

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  const avatarEl = document.getElementById('sidebar-user-avatar');
  if (avatarEl) avatarEl.innerText = initials || 'AW';

  const heroNameEl = document.getElementById('hero-student-name');
  if (heroNameEl) heroNameEl.innerText = name;

  const heroSubEl = document.getElementById('hero-profile-subtitle');
  if (heroSubEl) heroSubEl.innerText = `${college} • ${branch} '${year.slice(-2)}`;

  document.getElementById('auth-view')?.classList.add('hidden');
  document.getElementById('app-shell')?.classList.remove('hidden');

  updateGaugeVisual(state.currentScore || 0);
  switchView('dashboard');
  showToast(`Welcome ${name}! Candidate portal initialized for ${college}.`);
}

export function demoSignIn(roleType) {
  if (roleType === 'Student') {
    const nameInput = document.getElementById('auth-name');
    const collegeInput = document.getElementById('auth-college');
    const branchInput = document.getElementById('auth-branch');
    const yearInput = document.getElementById('auth-year');

    if (nameInput) nameInput.value = 'Alexander Wright';
    if (collegeInput) collegeInput.value = 'Stanford University';
    if (branchInput) branchInput.value = 'Computer Science & Engineering';
    if (yearInput) yearInput.value = '2026';

    handleAuthSubmit({ preventDefault: () => {} });
  } else {
    state.currentUser = {
      name: 'Dr. Robert Vance (TPO)',
      email: 'tpo@university.edu',
      college: 'Stanford University',
      branch: 'Placement Cell',
      year: 'Admin',
      role: 'TPO'
    };

    const nameEl = document.getElementById('sidebar-user-name');
    if (nameEl) nameEl.innerText = 'Dr. Robert Vance (TPO)';

    const roleEl = document.getElementById('sidebar-user-role');
    if (roleEl) roleEl.innerText = 'Placement Officer';

    const avatarEl = document.getElementById('sidebar-user-avatar');
    if (avatarEl) avatarEl.innerText = 'TP';

    const heroNameEl = document.getElementById('hero-student-name');
    if (heroNameEl) heroNameEl.innerText = 'TPO Officer';

    const heroSubEl = document.getElementById('hero-profile-subtitle');
    if (heroSubEl) heroSubEl.innerText = 'Stanford University TPO Office • Campus Placement Coordinator';

    document.getElementById('auth-view')?.classList.add('hidden');
    document.getElementById('app-shell')?.classList.remove('hidden');
    switchView('college');
    showToast('Signed in as Campus Placement Officer (TPO Portal)');
  }
}

export function handleSignOut() {
  document.getElementById('app-shell')?.classList.add('hidden');
  document.getElementById('auth-view')?.classList.remove('hidden');
  showToast('Signed out successfully.');
}
