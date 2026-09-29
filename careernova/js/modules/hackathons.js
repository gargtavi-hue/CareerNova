/* CareerNova - Placement Hackathons & Sprints Module */

import { showToast } from './toast.js';

export function filterHackathons() {
  const statusFilter = document.getElementById('hackathon-status-filter');
  const catFilter = document.getElementById('hackathon-cat-filter');
  const cards = document.querySelectorAll('#hackathons-grid .item-card');
  const countEl = document.getElementById('hackathon-count');

  if (!statusFilter || !catFilter) return;

  const statusVal = statusFilter.value;
  const catVal = catFilter.value;
  let visibleCount = 0;

  cards.forEach(card => {
    const cardStatus = card.getAttribute('data-status');
    const cardCat = card.getAttribute('data-cat');

    const matchesStatus = (statusVal === 'All' || cardStatus === statusVal);
    const matchesCat = (catVal === 'All' || cardCat === catVal);

    if (matchesStatus && matchesCat) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (countEl) countEl.innerText = visibleCount;
}

export function registerHackathon(name) {
  showToast(`Registered team for ${name}!`);
}
