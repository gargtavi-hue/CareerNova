/* CareerNova - Mock Interview Simulation Module */

import { MOCK_QUESTIONS } from '../data/mock-questions.js';
import { state } from '../state.js';
import { updateGaugeVisual } from './dashboard.js';
import { showToast } from './toast.js';

let selectedInterviewType = 'technical';
let mockQuestions = [];
let currentMockQuestion = 0;
let mockAnswers = [];
let mockQuestionCount = 10;

export function openMockInterviewModal() {
  document.getElementById('mock-interview-modal')?.classList.remove('hidden');
}

export function closeMockInterviewModal() {
  document.getElementById('mock-interview-modal')?.classList.add('hidden');
}

export function selectInterviewType(type, button) {
  selectedInterviewType = type;
  document.querySelectorAll('.interview-type-card').forEach(card => {
    card.classList.remove('selected');
  });
  if (button) button.classList.add('selected');
}

export function startMockSession() {
  const diffEl = document.getElementById('interview-difficulty');
  const countEl = document.getElementById('interview-question-count');

  const difficulty = diffEl ? diffEl.value : 'medium';
  mockQuestionCount = countEl ? Number(countEl.value) : 10;

  const pool = MOCK_QUESTIONS[selectedInterviewType]?.[difficulty] || [];

  if (pool.length === 0) {
    showToast('No questions available for this configuration.');
    return;
  }

  mockQuestions = shuffleArray(pool).slice(0, Math.min(mockQuestionCount, pool.length));
  currentMockQuestion = 0;
  mockAnswers = [];

  closeMockInterviewModal();
  document.getElementById('mock-session-modal')?.classList.remove('hidden');
  displayMockQuestion();
}

export function displayMockQuestion() {
  const question = mockQuestions[currentMockQuestion];
  const total = mockQuestions.length;

  const qNum = document.getElementById('mock-question-number');
  if (qNum) qNum.innerText = `Question ${currentMockQuestion + 1} of ${total}`;

  const qCounter = document.getElementById('mock-question-counter');
  if (qCounter) qCounter.innerText = `${currentMockQuestion + 1} / ${total}`;

  const qText = document.getElementById('mock-question-text');
  if (qText) qText.innerText = question;

  const qType = document.getElementById('mock-question-type');
  if (qType) qType.innerText = getInterviewTypeName(selectedInterviewType);

  const diffEl = document.getElementById('interview-difficulty');
  const qDiff = document.getElementById('mock-question-difficulty');
  if (qDiff && diffEl) qDiff.innerText = getDifficultyName(diffEl.value);

  const progress = (currentMockQuestion / total) * 100;
  const pBar = document.getElementById('mock-progress-bar');
  if (pBar) pBar.style.width = `${progress}%`;

  const ansInput = document.getElementById('mock-answer');
  if (ansInput) {
    ansInput.value = '';
    ansInput.focus();
  }
}

export function submitMockAnswer() {
  const ansInput = document.getElementById('mock-answer');
  const answer = ansInput ? ansInput.value.trim() : '';

  if (!answer) {
    showToast('Please type your answer before proceeding.');
    return;
  }

  mockAnswers.push({
    question: mockQuestions[currentMockQuestion],
    answer: answer
  });

  if (currentMockQuestion < mockQuestions.length - 1) {
    currentMockQuestion++;
    displayMockQuestion();
  } else {
    finishMockInterview();
  }
}

export function finishMockInterview() {
  document.getElementById('mock-session-modal')?.classList.add('hidden');

  const result = evaluateMockInterview();

  const finalScoreEl = document.getElementById('mock-final-score');
  if (finalScoreEl) finalScoreEl.innerText = result.overall;

  const accEl = document.getElementById('mock-accuracy-score');
  if (accEl) accEl.innerText = `${result.accuracy}%`;

  const commEl = document.getElementById('mock-communication-score');
  if (commEl) commEl.innerText = `${result.communication}%`;

  const compEl = document.getElementById('mock-completeness-score');
  if (compEl) compEl.innerText = `${result.completeness}%`;

  const titleEl = document.getElementById('mock-result-title');
  if (titleEl) titleEl.innerText = result.title;

  const summaryEl = document.getElementById('mock-result-summary');
  if (summaryEl) summaryEl.innerText = result.summary;

  const strList = document.getElementById('mock-strengths');
  if (strList) {
    strList.innerHTML = result.strengths.map(item => `<li>${item}</li>`).join('');
  }

  const impList = document.getElementById('mock-improvements');
  if (impList) {
    impList.innerHTML = result.improvements.map(item => `<li>${item}</li>`).join('');
  }

  const nextEl = document.getElementById('mock-next-steps');
  if (nextEl) nextEl.innerText = result.nextSteps;

  document.getElementById('mock-results-modal')?.classList.remove('hidden');

  // Update placement readiness index
  updateGaugeVisual(Math.max(state.currentScore, result.overall));
  showToast(`Diagnostic complete! Your evaluated score: ${result.overall}/100`);
}

export function evaluateMockInterview() {
  let totalLength = 0;
  let detailedAnswers = 0;

  mockAnswers.forEach(item => {
    totalLength += item.answer.length;
    if (item.answer.length >= 120) {
      detailedAnswers++;
    }
  });

  const avgLength = mockAnswers.length > 0 ? totalLength / mockAnswers.length : 0;

  let communication = avgLength >= 200 ? 92 : avgLength >= 120 ? 82 : avgLength >= 60 ? 68 : 50;
  let completeness = mockAnswers.length > 0 ? Math.round((detailedAnswers / mockAnswers.length) * 100) : 0;
  let accuracy = selectedInterviewType === 'hr' ? Math.min(95, communication + 5) : Math.min(95, communication);

  let overall = Math.round((accuracy + communication + completeness) / 3);

  let title;
  let summary;

  if (overall >= 85) {
    title = 'Top Tier Placement Performance';
    summary = 'Your answers demonstrated solid technical reasoning and clear articulation. Keep practicing under timed pressure to stay sharp.';
  } else if (overall >= 70) {
    title = 'Competent Candidate Baseline';
    summary = 'You established a solid conceptual foundation. Structure your explanations using bullet points and trade-off comparisons.';
  } else {
    title = 'Targeted Practice Recommended';
    summary = 'Your responses would benefit from greater depth, concrete examples, and algorithmic complexity analysis.';
  }

  return {
    overall,
    accuracy,
    communication,
    completeness,
    title,
    summary,
    strengths: [
      'Completed all questions without quitting early.',
      'Showed willingness to communicate technical trade-offs.',
      avgLength >= 120 ? 'Provided rich context and supporting rationale.' : 'Kept answers concise and direct.'
    ],
    improvements: [
      avgLength < 120 ? 'Include more technical depth and code examples.' : 'Focus on concise STAR formatting for clarity.',
      selectedInterviewType === 'dsa' ? 'Explicitly state Big-O Time & Space complexity.' : 'Cite real-world project scenarios to back up your claims.',
      'Practice thinking out loud to simulate phone screening environments.'
    ],
    nextSteps: selectedInterviewType === 'dsa' 
      ? 'Head over to the DSA Practice tab to solve high-frequency graph and dynamic programming questions.'
      : 'Review the Top Tech Applications tab to tailor answers to company-specific values.'
  };
}

export function exitMockSession() {
  const confirmed = confirm('Are you sure you want to exit? Your current session progress will be lost.');
  if (!confirmed) return;

  document.getElementById('mock-session-modal')?.classList.add('hidden');
  mockQuestions = [];
  mockAnswers = [];
  currentMockQuestion = 0;
}

export function closeMockResults() {
  document.getElementById('mock-results-modal')?.classList.add('hidden');
}

export function restartMockInterview() {
  closeMockResults();
  openMockInterviewModal();
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getInterviewTypeName(type) {
  const names = {
    technical: 'Technical CS',
    hr: 'HR / Behavioral',
    dsa: 'Data Structures & Algorithms',
    company: 'Company Focus'
  };
  return names[type] || 'Technical';
}

function getDifficultyName(level) {
  const names = {
    easy: 'Beginner',
    medium: 'Intermediate',
    hard: 'Advanced'
  };
  return names[level] || 'Intermediate';
}
