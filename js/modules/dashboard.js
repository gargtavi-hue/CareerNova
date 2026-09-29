/* CareerNova - Dashboard Gauge & Metrics Logic */

import { state, setScore } from '../state.js';

export function updateGaugeVisual(score) {
  const currentScore = setScore(score);

  // SVG Circle r=65, circumference = 2 * PI * 65 ≈ 408
  const circumference = 408;
  const offset = circumference - (circumference * currentScore / 100);

  const circleEl = document.getElementById('readiness-gauge-circle');
  if (circleEl) {
    circleEl.style.strokeDashoffset = offset;
  }

  const scoreText = document.getElementById('gauge-score-text');
  if (scoreText) {
    scoreText.innerText = `${currentScore}%`;
  }

  const tierBadge = document.getElementById('gauge-tier-badge');
  if (tierBadge) {
    if (currentScore === 0) {
      tierBadge.innerText = 'Diagnostic Baseline: 0%';
      tierBadge.className = 'badge badge-navy';
    } else if (currentScore >= 85) {
      tierBadge.innerText = 'Tier 1 Qualified';
      tierBadge.className = 'badge badge-green';
    } else if (currentScore >= 60) {
      tierBadge.innerText = 'Tier 2 Candidate';
      tierBadge.className = 'badge badge-orange';
    } else {
      tierBadge.innerText = `Preparation Score: ${currentScore}%`;
      tierBadge.className = 'badge badge-navy';
    }
  }

  // Update System Architecture and Resume Audit bars proportionally
  const sysBar = document.getElementById('skill-sys-bar');
  const sysText = document.getElementById('skill-sys-text');
  if (sysBar && sysText) {
    const sysVal = Math.min(100, Math.round(currentScore * 0.9));
    sysBar.style.width = `${sysVal}%`;
    sysText.innerText = `${sysVal}%`;
  }

  const resBar = document.getElementById('skill-res-bar');
  const resText = document.getElementById('skill-res-text');
  if (resBar && resText) {
    const resVal = Math.min(100, Math.round(currentScore * 0.85));
    resBar.style.width = `${resVal}%`;
    resText.innerText = `${resVal}%`;
  }
}

export function updatePriorityTask(title, desc, btnLabel, actionFn) {
  const tEl = document.getElementById('priority-title-text');
  const dEl = document.getElementById('priority-desc-text');
  const bEl = document.getElementById('priority-cta-btn');
  if (tEl) tEl.innerText = title;
  if (dEl) dEl.innerText = desc;
  if (bEl) {
    bEl.innerText = btnLabel;
    bEl.onclick = actionFn;
  }
}
