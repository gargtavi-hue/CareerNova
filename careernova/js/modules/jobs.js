/* CareerNova - Verified Job Postings Module */

import { showToast } from './toast.js';

export function filterJobs() {
  const roleFilter = document.getElementById('job-role-filter');
  const typeFilter = document.getElementById('job-type-filter');
  const rows = document.querySelectorAll('#jobs-container .job-row');
  const countEl = document.getElementById('job-count');

  if (!roleFilter || !typeFilter) return;

  const roleVal = roleFilter.value;
  const typeVal = typeFilter.value;
  let visibleCount = 0;

  rows.forEach(row => {
    const rowRole = row.getAttribute('data-role');
    const rowType = row.getAttribute('data-type');

    const matchesRole = (roleVal === 'All' || rowRole === roleVal);
    const matchesType = (typeVal === 'All' || rowType === typeVal);

    if (matchesRole && matchesType) {
      row.style.display = 'flex';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  if (countEl) countEl.innerText = visibleCount;
}

export function toggleSavedJob(button) {
  if (!button) return;
  button.classList.toggle('saved');

  if (button.classList.contains('saved')) {
    button.innerText = '♥';
    showToast('Job saved successfully.');
  } else {
    button.innerText = '♡';
    showToast('Job removed from saved jobs.');
  }
}
