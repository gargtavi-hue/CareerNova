/* CareerNova - College TPO Placement Portal Module */

import { showToast } from './toast.js';

export function filterTpoRoster() {
  const branchFilter = document.getElementById('tpo-branch-filter');
  const statusFilter = document.getElementById('tpo-status-filter');
  const rows = document.querySelectorAll('#tpo-table-body tr');
  const countEl = document.getElementById('tpo-student-count');

  if (!branchFilter || !statusFilter) return;

  const branchVal = branchFilter.value;
  const statusVal = statusFilter.value;
  let visibleCount = 0;

  rows.forEach(row => {
    const rowBranch = row.getAttribute('data-branch');
    const rowStatus = row.getAttribute('data-status');

    const matchesBranch = (branchVal === 'All' || rowBranch === branchVal);
    const matchesStatus = (statusVal === 'All' || rowStatus === statusVal);

    if (matchesBranch && matchesStatus) {
      row.style.display = 'table-row';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  if (countEl) countEl.innerText = visibleCount;
}

export function exportTpoReport() {
  showToast('Generating official Campus Placement Report PDF...');
}
