/* CareerNova - Placement Hackathons & Corporate Sprints Module */

import { showToast } from './toast.js';
import { state, registerHackathonState, unregisterHackathonState, isHackathonRegistered } from '../state.js';
import { HACKATHONS_DATA } from '../data/hackathons-data.js';

let activeQuickFilter = 'all';

/**
 * Filter hackathons by status, category, mode, and search keyword.
 * Extends the existing CareerNova filtering logic.
 */
export function filterHackathons() {
  const statusFilter = document.getElementById('hackathon-status-filter');
  const catFilter = document.getElementById('hackathon-cat-filter');
  const modeFilter = document.getElementById('hackathon-mode-filter');
  const searchInput = document.getElementById('hackathon-search');
  const cards = document.querySelectorAll('#hackathons-grid .item-card');
  const countEl = document.getElementById('hackathon-count');

  if (!statusFilter || !catFilter || !modeFilter || !cards) return;

  const statusVal = statusFilter.value;
  const catVal = catFilter.value;
  const modeVal = modeFilter.value;
  const searchVal = (searchInput ? searchInput.value || '' : '').toLowerCase().trim();

  let visibleCount = 0;

  cards.forEach(card => {
    // Read data attributes
    const cardStatus = card.getAttribute('data-status') || '';
    const cardCat = card.getAttribute('data-cat') || '';
    const cardMode = card.getAttribute('data-mode') || '';
    const cardPrize = parseInt(card.getAttribute('data-prize') || '0', 10);
    const isRegistered = card.getAttribute('data-registered') === 'true';

    // Status filtering
    let matchesStatus = false;
    if (statusVal === 'All') {
      matchesStatus = true;
    } else if (statusVal === 'Upcoming') {
      matchesStatus = cardStatus === 'Upcoming';
    } else if (statusVal === 'Closing Soon') {
      matchesStatus = cardStatus === 'Closing Soon';
    } else if (statusVal === 'Closed') {
      matchesStatus = cardStatus === 'Closed';
    } else if (statusVal === 'Registered') {
      matchesStatus = isRegistered;
    } else {
      matchesStatus = cardStatus.toLowerCase() === statusVal.toLowerCase();
    }

    // Category filtering
    let matchesCat = false;
    if (catVal === 'All') {
      matchesCat = true;
    } else {
      matchesCat = cardCat === catVal || cardCat.toLowerCase().includes(catVal.toLowerCase());
    }

    // Mode filtering
    let matchesMode = false;
    if (modeVal === 'All') {
      matchesMode = true;
    } else {
      matchesMode = cardMode.toLowerCase() === modeVal.toLowerCase() ||
                    (modeVal === 'Offline' && cardMode.toLowerCase().includes('offline')) ||
                    (modeVal === 'Online' && cardMode.toLowerCase().includes('online'));
    }

    // Quick Pill filtering
    let matchesQuickPill = true;
    if (activeQuickFilter === 'closing-soon') {
      matchesQuickPill = (cardStatus === 'Closing Soon');
    } else if (activeQuickFilter === 'online') {
      matchesQuickPill = (cardMode === 'Online');
    } else if (activeQuickFilter === 'offline') {
      matchesQuickPill = (cardMode === 'Offline' || cardMode === 'Hybrid');
    } else if (activeQuickFilter === 'high-prize') {
      matchesQuickPill = cardPrize >= 400000;
    } else if (activeQuickFilter === 'registered') {
      matchesQuickPill = isRegistered;
    }

    // Search filtering - checks title, organizer, category, mode, description, eligibility, prize, tags
    let matchesSearch = true;
    if (searchVal) {
      matchesSearch = false;
      const titleEl = card.querySelector('.item-title') || card.querySelector('.hackathon-title');
      const subTitleEl = card.querySelector('.item-subtitle') || card.querySelector('.hackathon-org');
      const bodyEl = card.querySelector('.item-body') || card.querySelector('.hackathon-desc');
      const fullText = card.innerText.toLowerCase();
      const dataSearch = (card.getAttribute('data-search') || '').toLowerCase();

      if (
        (titleEl && titleEl.innerText.toLowerCase().includes(searchVal)) ||
        (subTitleEl && subTitleEl.innerText.toLowerCase().includes(searchVal)) ||
        (bodyEl && bodyEl.innerText.toLowerCase().includes(searchVal)) ||
        fullText.includes(searchVal) ||
        dataSearch.includes(searchVal)
      ) {
        matchesSearch = true;
      }
    }

    // Combined visibility condition
    if (matchesStatus && matchesCat && matchesMode && matchesQuickPill && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (countEl) countEl.innerText = visibleCount;

  // Handle empty state display
  const emptyState = document.getElementById('hackathon-empty-state');
  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  // Handle search clear button
  const clearBtn = document.getElementById('hackathon-search-clear');
  if (clearBtn) {
    clearBtn.style.display = searchVal ? 'inline-flex' : 'none';
  }
}

/**
 * Reset all filters to default 'All' and clear search input
 */
export function clearHackathonFilters() {
  const statusFilter = document.getElementById('hackathon-status-filter');
  const catFilter = document.getElementById('hackathon-cat-filter');
  const modeFilter = document.getElementById('hackathon-mode-filter');
  const searchInput = document.getElementById('hackathon-search');

  if (statusFilter) statusFilter.value = 'All';
  if (catFilter) catFilter.value = 'All';
  if (modeFilter) modeFilter.value = 'All';
  if (searchInput) searchInput.value = '';

  activeQuickFilter = 'all';
  document.querySelectorAll('.hackathon-quick-pill').forEach(pill => {
    pill.classList.remove('active');
  });
  const allPill = document.querySelector('.hackathon-quick-pill[data-filter="all"]');
  if (allPill) allPill.classList.add('active');

  filterHackathons();
  showToast('Filters reset to show all hackathons.');
}

/**
 * Clear only the search input
 */
export function clearHackathonSearch() {
  const searchInput = document.getElementById('hackathon-search');
  if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
  }
  filterHackathons();
}

/**
 * Select quick filter pill
 */
export function setHackathonQuickFilter(filterType, element) {
  activeQuickFilter = filterType;

  document.querySelectorAll('.hackathon-quick-pill').forEach(p => p.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }

  // Optional: keep select dropdowns synced when clicking a direct status pill
  const statusFilter = document.getElementById('hackathon-status-filter');
  if (statusFilter) {
    if (filterType === 'closing-soon') {
      statusFilter.value = 'Closing Soon';
    } else if (filterType === 'registered') {
      statusFilter.value = 'Registered';
    } else if (filterType === 'all') {
      statusFilter.value = 'All';
    }
  }

  filterHackathons();
}

/**
 * Legacy & quick registration handler
 */
export function registerHackathon(name, hackathonId = null) {
  if (hackathonId) {
    openHackathonRegister(hackathonId);
    return;
  }
  showToast(`Registered team for ${name}!`);
}

/**
 * Open registration modal for specific hackathon
 */
export function openHackathonRegister(hackathonId) {
  const hackathon = HACKATHONS_DATA[hackathonId];
  if (!hackathon) {
    showToast('Hackathon details not found.');
    return;
  }

  if (hackathon.status === 'Closed') {
    showToast('Registration for this hackathon has closed.');
    return;
  }

  if (isHackathonRegistered(hackathonId)) {
    // If already registered, offer option to unregister or view info
    if (confirm(`You are already registered for ${hackathon.title}. Would you like to withdraw your registration?`)) {
      unregisterHackathonState(hackathonId);
      updateRegisteredCardsUI();
      filterHackathons();
      showToast(`Registration withdrawn for ${hackathon.title}.`);
    }
    return;
  }

  const modal = document.getElementById('hackathon-register-modal');
  if (!modal) return;

  // Set modal fields
  document.getElementById('reg-hackathon-id').value = hackathon.id;
  document.getElementById('reg-modal-title').innerText = `Register: ${hackathon.title}`;
  document.getElementById('reg-modal-sponsor').innerText = `${hackathon.organizer} • Deadline: ${hackathon.deadline}`;
  document.getElementById('reg-modal-prize').innerText = `${hackathon.prize} Prize • Mode: ${hackathon.mode}`;

  // Pre-fill user profile info
  const user = state.currentUser || {};
  const leadNameInput = document.getElementById('reg-lead-name');
  const leadEmailInput = document.getElementById('reg-lead-email');
  const leadCollegeInput = document.getElementById('reg-lead-college');
  const teamNameInput = document.getElementById('reg-team-name');

  if (leadNameInput) leadNameInput.value = user.name || 'Alex Wright';
  if (leadEmailInput) leadEmailInput.value = user.email || 'alex.wright@university.edu';
  if (leadCollegeInput) leadCollegeInput.value = user.college || 'Stanford University';
  if (teamNameInput) teamNameInput.value = `Team Nova ${Math.floor(100 + Math.random() * 900)}`;

  // Populate track options
  const trackSelect = document.getElementById('reg-track-select');
  if (trackSelect) {
    trackSelect.innerHTML = '<option value="General Track">General / Best Overall Innovation</option>';
    if (hackathon.problemStatements && hackathon.problemStatements.length > 0) {
      hackathon.problemStatements.forEach(ps => {
        const opt = document.createElement('option');
        opt.value = ps;
        opt.innerText = ps;
        trackSelect.appendChild(opt);
      });
    }
  }

  modal.classList.remove('hidden');
}

/**
 * Close registration modal
 */
export function closeHackathonRegisterModal() {
  const modal = document.getElementById('hackathon-register-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Submit registration form
 */
export function submitHackathonRegistration(event) {
  if (event) event.preventDefault();

  const hackathonId = document.getElementById('reg-hackathon-id').value;
  const teamName = document.getElementById('reg-team-name').value.trim() || 'Team Nova';
  const teamSize = document.getElementById('reg-team-size').value;
  const selectedTrack = document.getElementById('reg-track-select').value;
  const hackathon = HACKATHONS_DATA[hackathonId];
  const hackathonTitle = hackathon ? hackathon.title : 'the hackathon';

  // Save to application state & localStorage
  registerHackathonState(hackathonId, {
    teamName,
    teamSize,
    selectedTrack,
    registeredAt: new Date().toLocaleDateString()
  });

  updateRegisteredCardsUI();
  filterHackathons();
  closeHackathonRegisterModal();

  showToast(`🎉 Registered "${teamName}" for ${hackathonTitle}! Confirmation sent.`);
}

/**
 * Open detail preview modal for a hackathon
 */
export function openHackathonModal(hackathonId) {
  const hackathon = HACKATHONS_DATA[hackathonId];
  if (!hackathon) {
    showToast('Hackathon details not found.');
    return;
  }

  const modal = document.getElementById('hackathon-detail-modal');
  if (!modal) return;

  document.getElementById('modal-hack-icon').innerText = hackathon.icon || '🔥';
  document.getElementById('modal-hack-title').innerText = hackathon.title;
  document.getElementById('modal-hack-organizer').innerText = hackathon.organizer;
  document.getElementById('modal-hack-status').innerText = hackathon.status;
  document.getElementById('modal-hack-status').className = `badge ${hackathon.statusBadgeClass || 'badge-navy'}`;
  document.getElementById('modal-hack-category').innerText = hackathon.category;
  document.getElementById('modal-hack-mode').innerText = hackathon.mode;
  document.getElementById('modal-hack-deadline').innerText = hackathon.deadline;
  document.getElementById('modal-hack-prize').innerText = hackathon.prize;
  document.getElementById('modal-hack-prize-sub').innerText = hackathon.prizeSubtitle || '';
  document.getElementById('modal-hack-eligibility').innerText = hackathon.eligibility;
  document.getElementById('modal-hack-teamsize').innerText = hackathon.teamSize;
  document.getElementById('modal-hack-location').innerText = hackathon.location;
  document.getElementById('modal-hack-description').innerText = hackathon.description;

  // Problem statements list
  const psList = document.getElementById('modal-hack-problems');
  if (psList) {
    psList.innerHTML = '';
    (hackathon.problemStatements || []).forEach(ps => {
      const li = document.createElement('li');
      li.innerText = ps;
      psList.appendChild(li);
    });
  }

  // Rounds / Timeline
  const roundsList = document.getElementById('modal-hack-rounds');
  if (roundsList) {
    roundsList.innerHTML = '';
    (hackathon.rounds || []).forEach(r => {
      const li = document.createElement('li');
      li.innerText = r;
      roundsList.appendChild(li);
    });
  }

  // Perks & Incentives
  const perksList = document.getElementById('modal-hack-perks');
  if (perksList) {
    perksList.innerHTML = '';
    (hackathon.perks || []).forEach(p => {
      const li = document.createElement('li');
      li.innerText = p;
      perksList.appendChild(li);
    });
  }

  // External Portal link
  const portalBtn = document.getElementById('modal-hack-portal-btn');
  if (portalBtn) {
    portalBtn.href = hackathon.officialUrl || 'https://unstop.com/';
  }

  // Register CTA button in modal
  const regCtaBtn = document.getElementById('modal-hack-register-btn');
  if (regCtaBtn) {
    if (hackathon.status === 'Closed') {
      regCtaBtn.innerText = 'Registration Closed';
      regCtaBtn.disabled = true;
      regCtaBtn.className = 'btn-secondary';
      regCtaBtn.onclick = null;
    } else if (isHackathonRegistered(hackathonId)) {
      regCtaBtn.innerText = '✓ Registered';
      regCtaBtn.disabled = false;
      regCtaBtn.className = 'btn-secondary btn-registered';
      regCtaBtn.onclick = () => {
        closeHackathonModal();
        openHackathonRegister(hackathonId);
      };
    } else {
      regCtaBtn.innerText = 'Register Now ↗';
      regCtaBtn.disabled = false;
      regCtaBtn.className = 'btn-primary';
      regCtaBtn.onclick = () => {
        closeHackathonModal();
        openHackathonRegister(hackathonId);
      };
    }
  }

  modal.classList.remove('hidden');
}

/**
 * Close detail modal
 */
export function closeHackathonModal() {
  const modal = document.getElementById('hackathon-detail-modal');
  if (modal) modal.classList.add('hidden');
}

/**
 * Update card registration badges and buttons across the DOM
 */
export function updateRegisteredCardsUI() {
  const cards = document.querySelectorAll('#hackathons-grid .item-card');
  let regCount = 0;

  cards.forEach(card => {
    const hackathonId = card.getAttribute('data-id');
    const isRegistered = isHackathonRegistered(hackathonId);
    card.setAttribute('data-registered', isRegistered ? 'true' : 'false');

    const regBtn = card.querySelector('.register-btn');
    if (regBtn) {
      if (card.getAttribute('data-status') === 'Closed') {
        regBtn.innerText = 'Registration Closed';
        regBtn.disabled = true;
        regBtn.classList.remove('btn-primary', 'btn-registered');
        regBtn.classList.add('btn-secondary');
        regBtn.style.opacity = '0.65';
        regBtn.style.cursor = 'not-allowed';
      } else if (isRegistered) {
        regCount++;
        regBtn.innerHTML = '✓ Registered';
        regBtn.disabled = false;
        regBtn.classList.remove('btn-primary');
        regBtn.classList.add('btn-secondary', 'btn-registered');
        regBtn.style.opacity = '1';
        regBtn.style.cursor = 'pointer';
        regBtn.title = 'Click to view or withdraw registration';
      } else {
        regBtn.innerHTML = 'Register Now ↗';
        regBtn.disabled = false;
        regBtn.classList.remove('btn-registered', 'btn-secondary');
        regBtn.classList.add('btn-primary');
        regBtn.style.opacity = '1';
        regBtn.style.cursor = 'pointer';
        regBtn.title = 'Register team for this hackathon';
      }
    }
  });

  // Update badge counter in summary bar
  const badgeCountEl = document.getElementById('hackathon-registered-count-badge');
  if (badgeCountEl) {
    badgeCountEl.innerText = regCount;
  }
}

/**
 * Module initialization
 */
export function initHackathonsModule() {
  updateRegisteredCardsUI();
  filterHackathons();
}
