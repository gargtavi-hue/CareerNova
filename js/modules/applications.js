/* CareerNova - Top Tech Applications & Company Preparation Module */

import { COMPANY_PREP_DATA } from '../data/company-prep.js';
import { showToast } from './toast.js';

export function filterCompanies() {
  const searchInput = document.getElementById('company-search');
  const categoryFilter = document.getElementById('company-category-filter');
  const cards = document.querySelectorAll('.company-card');

  if (!searchInput || !categoryFilter) return;

  const searchValue = searchInput.value.toLowerCase().trim();
  const categoryValue = categoryFilter.value;

  cards.forEach(card => {
    const company = card.dataset.company ? card.dataset.company.toLowerCase() : '';
    const category = card.dataset.category || '';
    const searchData = card.dataset.search ? card.dataset.search.toLowerCase() : '';

    const matchesSearch = !searchValue ||
      company.includes(searchValue) ||
      searchData.includes(searchValue);

    const matchesCategory =
      categoryValue === 'All' ||
      category === categoryValue;

    if (matchesSearch && matchesCategory) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

export function openCompanyPreparation(companyName) {
  const data = COMPANY_PREP_DATA[companyName];

  if (!data) {
    showToast('Company preparation data is not available yet.');
    return;
  }

  const nameEl = document.getElementById('prep-company-name');
  if (nameEl) nameEl.innerText = companyName;

  const roleSubEl = document.getElementById('prep-company-role');
  if (roleSubEl) roleSubEl.innerText = data.roles;

  const rolesEl = document.getElementById('prep-roles');
  if (rolesEl) rolesEl.innerText = data.roles;

  const diffEl = document.getElementById('prep-difficulty');
  if (diffEl) diffEl.innerText = data.difficulty;

  const roundsEl = document.getElementById('prep-rounds');
  if (roundsEl) roundsEl.innerText = data.rounds;

  // Skills
  const skillsContainer = document.getElementById('prep-skills');
  if (skillsContainer) {
    skillsContainer.innerHTML = '';
    data.skills.forEach(skill => {
      const tag = document.createElement('span');
      tag.className = 'prep-tag';
      tag.innerText = skill;
      skillsContainer.appendChild(tag);
    });
  }

  // DSA Topics
  const dsaContainer = document.getElementById('prep-dsa');
  if (dsaContainer) {
    dsaContainer.innerHTML = '';
    data.dsa.forEach(topic => {
      const tag = document.createElement('span');
      tag.className = 'prep-tag';
      tag.innerText = topic;
      dsaContainer.appendChild(tag);
    });
  }

  // Practice Questions
  const questionsContainer = document.getElementById('prep-questions');
  if (questionsContainer) {
    questionsContainer.innerHTML = '';
    data.questions.forEach((question, index) => {
      const questionBox = document.createElement('div');
      questionBox.className = 'prep-question';
      questionBox.innerHTML = `<strong>Q${index + 1}.</strong> ${question}`;
      questionsContainer.appendChild(questionBox);
    });
  }

  // Checklist
  const checklistContainer = document.getElementById('prep-checklist');
  if (checklistContainer) {
    checklistContainer.innerHTML = '';
    data.checklist.forEach((item, index) => {
      const label = document.createElement('label');
      label.className = 'prep-check-item';
      label.innerHTML = `
        <input type="checkbox" id="prep-check-${companyName}-${index}">
        <span>${item}</span>
      `;
      checklistContainer.appendChild(label);
    });
  }

  // External Opportunity Link
  const opportunityButton = document.getElementById('prep-opportunity-btn');
  if (opportunityButton) {
    opportunityButton.onclick = function () {
      window.open(data.careers, '_blank');
    };
  }

  // Show modal
  document.getElementById('company-prep-modal')?.classList.remove('hidden');
}

export function closeCompanyPreparation() {
  document.getElementById('company-prep-modal')?.classList.add('hidden');
}
