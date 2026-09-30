/* CareerNova - View Switching & Global Search Navigation */

import { state } from '../state.js';
import { showToast } from './toast.js';
import { loadTpoRosterData } from './tpo.js';

export function switchView(viewId) {
  // Role Access Control
  if (state.currentUser?.role === 'Student' && viewId === 'college') {
    showToast('Access Denied: College TPO Portal is restricted to Placement Officers.');
    viewId = 'dashboard';
  } else if (state.currentUser?.role === 'TPO' && ['dashboard', 'dsa', 'applications', 'application-tracker', 'aichat'].includes(viewId)) {
    showToast('Candidate preparation modules are restricted to Students.');
    viewId = 'college';
  }

  // If app shell is hidden, reveal it and dismiss auth screen
  const appShell = document.getElementById('app-shell');
  if (appShell && appShell.classList.contains('hidden')) {
    appShell.classList.remove('hidden');
    document.getElementById('auth-view')?.classList.add('hidden');
  }

  if (viewId === 'college') {
    loadTpoRosterData();
  }

  document.body.classList.toggle('applications-active', viewId === 'applications');

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const pageViews = document.querySelectorAll('.page-view');
  pageViews.forEach(view => {
    if (view.id === `view-${viewId}`) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });
}

export function handleGlobalSearch(query) {
  if (!query) return;
  const q = query.toLowerCase().trim();

  if (q.includes('dsa') || q.includes('tree') || q.includes('algorithm') || q.includes('array') || q.includes('stack')) {
    if (state.currentUser?.role !== 'TPO') {
      switchView('dsa');
      const searchInput = document.getElementById('dsa-search');
      if (searchInput) {
        searchInput.value = query;
        const event = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(event);
      }
    } else {
      switchView('college');
    }
  } else if (q.includes('job') || q.includes('google') || q.includes('microsoft') || q.includes('amazon') || q.includes('hire')) {
    switchView('jobs');
  } else if (q.includes('college') || q.includes('tpo') || q.includes('campus') || q.includes('roster')) {
    if (state.currentUser?.role === 'TPO') {
      switchView('college');
    } else {
      showToast('TPO Portal is restricted to official Placement Officers.');
    }
  } else if (q.includes('hackathon') || q.includes('sprint') || q.includes('challenge') || q.includes('sih') || q.includes('grid')) {
    switchView('hackathons');
    const hackSearch = document.getElementById('hackathon-search');
    if (hackSearch) {
      hackSearch.value = query;
      const event = new Event('input', { bubbles: true });
      hackSearch.dispatchEvent(event);
    }
  } else if (q.includes('application') || q.includes('company') || q.includes('tcs') || q.includes('nvidia') || q.includes('infosys')) {
    if (state.currentUser?.role !== 'TPO') {
      switchView('applications');
      const compSearch = document.getElementById('company-search');
      if (compSearch) {
        compSearch.value = query;
        const event = new Event('input', { bubbles: true });
        compSearch.dispatchEvent(event);
      }
    } else {
      switchView('college');
    }
  }
}
