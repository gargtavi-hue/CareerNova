/* CareerNova - DSA Practice Module */

import { state, markDsaSolved, unmarkDsaSolved } from '../state.js';
import { DSA_PROBLEMS } from '../data/dsa-problems.js';
import { updateGaugeVisual, updatePriorityTask } from './dashboard.js';
import { switchView } from './navigation.js';
import { showToast } from './toast.js';

let activeModalProblemId = null;

export function initDsaModule() {
  renderDsaProblems();
  updateDsaProgressUI();
}

export function renderDsaProblems(problems = getFilteredDsaProblems()) {
  const container = document.getElementById('dsa-problem-list');
  const noResults = document.getElementById('dsa-no-results');
  if (!container) return;

  container.innerHTML = '';

  if (problems.length === 0) {
    if (noResults) noResults.style.display = 'block';
    return;
  }

  if (noResults) noResults.style.display = 'none';

  problems.forEach(p => {
    const isCompleted = !!state.solvedDsaMap[p.id];
    const diffClass = p.difficulty.toLowerCase();

    const card = document.createElement('div');
    card.className = `dsa-problem-card ${isCompleted ? 'completed' : ''}`;
    card.setAttribute('data-id', p.id);
    card.onclick = () => openDsaProblem(p.id);

    const companyChips = p.companies.map(c => `<span class="company-chip">${c}</span>`).join('');

    card.innerHTML = `
      <div class="dsa-card-top">
        <span class="dsa-badge ${diffClass}">${p.difficulty}</span>
        <span class="dsa-problem-topic">${p.topic}</span>
      </div>
      <h3 class="dsa-problem-title">${p.title}</h3>
      <div class="dsa-company-list">
        ${companyChips}
      </div>
      <div class="dsa-card-actions">
        <a href="${p.leetcodeUrl}" target="_blank" class="leetcode-btn" onclick="event.stopPropagation()">
          Solve on LeetCode ↗
        </a>
        <button 
          class="complete-dsa-btn ${isCompleted ? 'completed-btn' : ''}" 
          onclick="event.stopPropagation(); toggleDsaCompleted(${p.id})">
          ${isCompleted ? 'Completed ✓' : 'Mark Complete'}
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function getFilteredDsaProblems() {
  const searchInput = document.getElementById('dsa-search');
  const topicFilter = document.getElementById('dsa-topic-filter');
  const diffFilter = document.getElementById('dsa-difficulty-filter');
  const compFilter = document.getElementById('dsa-company-filter');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedTopic = topicFilter ? topicFilter.value : 'all';
  const selectedDiff = diffFilter ? diffFilter.value : 'all';
  const selectedComp = compFilter ? compFilter.value : 'all';

  return DSA_PROBLEMS.filter(p => {
    const matchesSearch = !query || 
      p.title.toLowerCase().includes(query) ||
      p.topic.toLowerCase().includes(query) ||
      p.companies.some(c => c.toLowerCase().includes(query));

    const matchesTopic = selectedTopic === 'all' || p.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchesDiff = selectedDiff === 'all' || p.difficulty.toLowerCase() === selectedDiff.toLowerCase();
    const matchesComp = selectedComp === 'all' || p.companies.some(c => c.toLowerCase() === selectedComp.toLowerCase());

    return matchesSearch && matchesTopic && matchesDiff && matchesComp;
  });
}

export function filterDsaProblems() {
  renderDsaProblems(getFilteredDsaProblems());
}

export function openDsaProblem(problemId) {
  const problem = DSA_PROBLEMS.find(p => p.id === problemId);
  if (!problem) return;

  activeModalProblemId = problemId;
  const isCompleted = !!state.solvedDsaMap[problemId];

  const diffBadge = document.getElementById('modal-dsa-difficulty');
  if (diffBadge) {
    diffBadge.innerText = problem.difficulty;
    diffBadge.className = `dsa-badge ${problem.difficulty.toLowerCase()}`;
  }

  const titleEl = document.getElementById('modal-dsa-title');
  if (titleEl) titleEl.innerText = problem.title;

  const topicEl = document.getElementById('modal-dsa-topic');
  if (topicEl) topicEl.innerText = problem.topic;

  const companiesContainer = document.getElementById('modal-dsa-companies');
  if (companiesContainer) {
    companiesContainer.innerHTML = problem.companies
      .map(c => `<span class="company-chip">${c}</span>`)
      .join('');
  }

  const descEl = document.getElementById('modal-dsa-description');
  if (descEl) descEl.innerText = problem.description;

  const exEl = document.getElementById('modal-dsa-example');
  if (exEl) exEl.innerText = problem.example;

  const hintEl = document.getElementById('modal-dsa-hint');
  if (hintEl) hintEl.innerText = problem.hint;

  const leetcodeBtn = document.getElementById('modal-leetcode-btn');
  if (leetcodeBtn) {
    leetcodeBtn.onclick = () => window.open(problem.leetcodeUrl, '_blank');
  }

  const completeBtn = document.getElementById('modal-complete-btn');
  if (completeBtn) {
    completeBtn.className = `complete-dsa-btn ${isCompleted ? 'completed-btn' : ''}`;
    completeBtn.innerText = isCompleted ? 'Completed ✓' : 'Mark Completed';
    completeBtn.onclick = () => {
      toggleDsaCompleted(problemId);
      closeDsaProblem();
    };
  }

  const modal = document.getElementById('dsa-problem-modal');
  if (modal) modal.style.display = 'flex';
}

export function closeDsaProblem() {
  const modal = document.getElementById('dsa-problem-modal');
  if (modal) modal.style.display = 'none';
  activeModalProblemId = null;
}

export function openRandomDsa() {
  const unsolved = DSA_PROBLEMS.filter(p => !state.solvedDsaMap[p.id]);
  const pool = unsolved.length > 0 ? unsolved : DSA_PROBLEMS;
  const randomProblem = pool[Math.floor(Math.random() * pool.length)];
  if (randomProblem) {
    openDsaProblem(randomProblem.id);
  }
}

export function toggleDsaCompleted(problemId) {
  const problem = DSA_PROBLEMS.find(p => p.id === problemId);
  if (!problem) return;

  if (!state.solvedDsaMap[problemId]) {
    markDsaSolved(problemId);
    showToast(`Marked "${problem.title}" as completed!`);
  } else {
    unmarkDsaSolved(problemId);
    showToast(`Unmarked "${problem.title}".`);
  }

  updateDsaProgressUI();
  renderDsaProblems();

  // Dynamic score adjustment: ~8% boost per solved problem
  const newScore = Math.min(100, state.solvedDsaCount * 8);
  updateGaugeVisual(newScore);

  if (state.solvedDsaCount >= 5) {
    updatePriorityTask(
      'Step 2: Submit Google & Microsoft Campus Drive Applications',
      'Your DSA score is benchmarked! Next priority is submitting target application packages for scheduled recruitment drives.',
      'Apply to Target Drives →',
      () => switchView('applications')
    );
  }
}

export function updateDsaProgressUI() {
  const total = DSA_PROBLEMS.length;
  const solved = state.solvedDsaCount;
  const pct = Math.round((solved / total) * 100);

  const countEl = document.getElementById('dsa-solved-count');
  if (countEl) countEl.innerText = solved;

  const pctEl = document.getElementById('dsa-percentage');
  if (pctEl) pctEl.innerText = `${pct}%`;

  const barEl = document.getElementById('dsa-progress-bar');
  if (barEl) barEl.style.width = `${pct}%`;

  const streakEl = document.getElementById('dsa-streak');
  if (streakEl) streakEl.innerText = solved > 0 ? solved + 1 : 1;

  // Breakdown counts
  let easySolved = 0;
  let medSolved = 0;
  let hardSolved = 0;

  DSA_PROBLEMS.forEach(p => {
    if (state.solvedDsaMap[p.id]) {
      if (p.difficulty === 'Easy') easySolved++;
      else if (p.difficulty === 'Medium') medSolved++;
      else if (p.difficulty === 'Hard') hardSolved++;
    }
  });

  const easyEl = document.getElementById('dsa-easy-count');
  if (easyEl) easyEl.innerText = easySolved;

  const medEl = document.getElementById('dsa-medium-count');
  if (medEl) medEl.innerText = medSolved;

  const hardEl = document.getElementById('dsa-hard-count');
  if (hardEl) hardEl.innerText = hardSolved;

  // Sync with Dashboard skill bar
  const dsaBar = document.getElementById('skill-dsa-bar');
  const dsaText = document.getElementById('skill-dsa-text');
  if (dsaBar) dsaBar.style.width = `${pct}%`;
  if (dsaText) dsaText.innerText = `${solved} / ${total} Solved`;
}
