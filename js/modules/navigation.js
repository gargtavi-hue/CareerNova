/* CareerNova - View Switching & Global Search Navigation */

export function switchView(viewId) {
  // If app shell is hidden, reveal it and dismiss auth screen
  const appShell = document.getElementById('app-shell');
  if (appShell && appShell.classList.contains('hidden')) {
    appShell.classList.remove('hidden');
    document.getElementById('auth-view')?.classList.add('hidden');
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
    switchView('dsa');
    const searchInput = document.getElementById('dsa-search');
    if (searchInput) {
      searchInput.value = query;
      const event = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(event);
    }
  } else if (q.includes('job') || q.includes('google') || q.includes('microsoft') || q.includes('amazon') || q.includes('hire')) {
    switchView('jobs');
  } else if (q.includes('college') || q.includes('tpo') || q.includes('campus') || q.includes('roster')) {
    switchView('college');
  } else if (q.includes('hackathon') || q.includes('sprint') || q.includes('challenge') || q.includes('sih') || q.includes('grid')) {
    switchView('hackathons');
    const hackSearch = document.getElementById('hackathon-search');
    if (hackSearch) {
      hackSearch.value = query;
      const event = new Event('input', { bubbles: true });
      hackSearch.dispatchEvent(event);
    }
  } else if (q.includes('application') || q.includes('company') || q.includes('tcs') || q.includes('nvidia') || q.includes('infosys')) {
    switchView('applications');
    const compSearch = document.getElementById('company-search');
    if (compSearch) {
      compSearch.value = query;
      const event = new Event('input', { bubbles: true });
      compSearch.dispatchEvent(event);
    }
  }
}
