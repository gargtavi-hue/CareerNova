/* CareerNova - Master Application Entry Point */

import { state } from './state.js';
import { showToast } from './modules/toast.js';
import { handleAuthSubmit, demoSignIn, handleSignOut } from './modules/auth.js';
import { switchView, handleGlobalSearch } from './modules/navigation.js';
import { updateGaugeVisual, updatePriorityTask } from './modules/dashboard.js';
import { 
  initDsaModule, 
  filterDsaProblems, 
  openDsaProblem, 
  closeDsaProblem, 
  openRandomDsa, 
  toggleDsaCompleted 
} from './modules/dsa.js';
import { 
  filterCompanies, 
  openCompanyPreparation, 
  closeCompanyPreparation 
} from './modules/applications.js';
import { filterJobs, toggleSavedJob } from './modules/jobs.js';
import { filterHackathons, registerHackathon } from './modules/hackathons.js';
import { sendChatMessage, sendSuggestedChat } from './modules/chatbot.js';
import { 
  openMockInterviewModal, 
  closeMockInterviewModal, 
  selectInterviewType, 
  startMockSession, 
  submitMockAnswer, 
  exitMockSession, 
  closeMockResults, 
  restartMockInterview 
} from './modules/mock-interview.js';
import { filterTpoRoster, exportTpoReport } from './modules/tpo.js';

// Expose handlers to global window object for HTML inline event listeners
window.showToast = showToast;
window.handleAuthSubmit = handleAuthSubmit;
window.demoSignIn = demoSignIn;
window.handleSignOut = handleSignOut;
window.switchView = switchView;
window.handleGlobalSearch = handleGlobalSearch;
window.updateGaugeVisual = updateGaugeVisual;
window.updatePriorityTask = updatePriorityTask;

// DSA
window.filterDsaProblems = filterDsaProblems;
window.openDsaProblem = openDsaProblem;
window.closeDsaProblem = closeDsaProblem;
window.openRandomDsa = openRandomDsa;
window.toggleDsaCompleted = toggleDsaCompleted;

// Applications & Company Prep
window.filterCompanies = filterCompanies;
window.openCompanyPreparation = openCompanyPreparation;
window.closeCompanyPreparation = closeCompanyPreparation;

// Jobs
window.filterJobs = filterJobs;
window.toggleSavedJob = toggleSavedJob;

// Hackathons
window.filterHackathons = filterHackathons;
window.registerHackathon = registerHackathon;

// Coach
window.sendChatMessage = sendChatMessage;
window.sendSuggestedChat = sendSuggestedChat;

// Mock Interview
window.openMockInterviewModal = openMockInterviewModal;
window.closeMockInterviewModal = closeMockInterviewModal;
window.selectInterviewType = selectInterviewType;
window.startMockSession = startMockSession;
window.submitMockAnswer = submitMockAnswer;
window.exitMockSession = exitMockSession;
window.closeMockResults = closeMockResults;
window.restartMockInterview = restartMockInterview;

// College TPO
window.filterTpoRoster = filterTpoRoster;
window.exportTpoReport = exportTpoReport;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  updateGaugeVisual(0);
  initDsaModule();
});
