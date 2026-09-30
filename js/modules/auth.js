/* CareerNova - Secure Multi-Factor Authentication & Email OTP Module */

import { state } from '../state.js';
import { updateGaugeVisual } from './dashboard.js';
import { switchView } from './navigation.js';
import { showToast } from './toast.js';

const API_BASE_URL = (window.location.protocol.startsWith('http') && window.location.port === '5000') 
  ? '' 
  : 'http://localhost:5000';

let currentRole = 'Student'; // 'Student' | 'TPO'
let authMode = 'LOGIN';       // 'LOGIN' | 'REGISTER'
let pendingVerificationEmail = '';
let pendingVerificationRole = 'Student';
let pendingAuthMode = 'LOGIN'; // 'LOGIN' | 'REGISTER'
let pendingResetToken = '';

/**
 * Validates password strength rules:
 * - Minimum 8 characters
 * - Uppercase letter (A-Z)
 * - Lowercase letter (a-z)
 * - Number (0-9)
 * - Special character (!@#$%^&* etc.)
 */
export function checkPasswordStrength(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Must include at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Must include at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Must include at least one digit (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Must include at least one special character (!@#$%^&* etc.).' };
  }
  return { valid: true, message: 'Strong password!' };
}

export function onPasswordInput(value) {
  const hintEl = document.getElementById('password-strength-hint');
  if (!hintEl) return;

  if (!value || authMode === 'LOGIN') {
    hintEl.innerText = '';
    return;
  }

  const result = checkPasswordStrength(value);
  if (result.valid) {
    hintEl.className = 'password-strength-hint strength-strong';
    hintEl.innerText = '✓ Strong password';
  } else {
    hintEl.className = 'password-strength-hint strength-weak';
    hintEl.innerText = `✕ ${result.message}`;
  }
}

export function togglePasswordVisibility(fieldId, btn) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  const isPassword = field.type === 'password';
  field.type = isPassword ? 'text' : 'password';

  if (btn) {
    if (isPassword) {
      btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908A9.954 9.954 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-4.092-4.092a3 3 0 11-4.243-4.243M3 3l18 18"/></svg>`;
      btn.title = "Hide Password";
    } else {
      btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
      btn.title = "Show Password";
    }
  }
}

export function setAuthRole(role) {
  currentRole = role;
  const tabStudent = document.getElementById('tab-student');
  const tabTpo = document.getElementById('tab-tpo');
  const emailLabel = document.getElementById('auth-email-label');
  const emailInput = document.getElementById('auth-email');

  if (role === 'Student') {
    if (tabStudent) tabStudent.classList.add('active');
    if (tabTpo) tabTpo.classList.remove('active');
    if (emailLabel) emailLabel.innerText = 'College Email Address';
    if (emailInput) emailInput.placeholder = 'e.g. student@college.edu';
  } else {
    if (tabTpo) tabTpo.classList.add('active');
    if (tabStudent) tabStudent.classList.remove('active');
    if (emailLabel) emailLabel.innerText = 'Official College / TPO Email';
    if (emailInput) emailInput.placeholder = 'e.g. tpo@university.edu';
  }

  updateFormUIForCurrentState();
}

export function demoSignIn(roleType) {
  setAuthRole(roleType || 'Student');
}

export function toggleAuthMode() {
  authMode = authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN';
  updateFormUIForCurrentState();
}

function updateFormUIForCurrentState() {
  const titleEl = document.getElementById('auth-title');
  const subtitleEl = document.getElementById('auth-subtitle');
  const groupName = document.getElementById('group-auth-name');
  const groupCollege = document.getElementById('group-auth-college');
  const groupStudentFields = document.getElementById('student-fields-group');
  const groupConfirmPass = document.getElementById('group-confirm-password');
  const rowForgotPass = document.getElementById('row-forgot-password');
  const submitBtn = document.getElementById('auth-submit-btn');
  const promptEl = document.getElementById('auth-mode-switch-prompt');
  const switchBtn = document.getElementById('auth-mode-switch-btn');
  const hintEl = document.getElementById('password-strength-hint');
  const nameInput = document.getElementById('auth-name');

  if (hintEl) hintEl.innerText = '';

  if (authMode === 'LOGIN') {
    if (titleEl) {
      titleEl.innerText = currentRole === 'Student' ? 'Student Sign In' : 'TPO Officer Sign In';
    }
    if (subtitleEl) {
      subtitleEl.innerText = currentRole === 'Student' 
        ? 'Sign in to access your candidate placement dashboard.' 
        : 'Official administrative login for Campus Placement Officers.';
    }

    groupName?.classList.add('hidden');
    groupCollege?.classList.add('hidden');
    groupStudentFields?.classList.add('hidden');
    groupConfirmPass?.classList.add('hidden');
    rowForgotPass?.classList.remove('hidden');

    if (submitBtn) {
      submitBtn.innerHTML = currentRole === 'Student'
        ? `Sign In to Student Portal <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`
        : `Authorize TPO Sign In <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
    }

    if (promptEl) promptEl.innerText = "Don't have an account?";
    if (switchBtn) switchBtn.innerText = "Create Account";

  } else {
    // REGISTER MODE
    if (titleEl) {
      titleEl.innerText = currentRole === 'Student' ? 'Create Student Account' : 'Register TPO Officer Account';
    }
    if (subtitleEl) {
      subtitleEl.innerText = currentRole === 'Student' 
        ? 'Enter your details to create an account and verify via Email OTP.' 
        : 'Enter your institutional details to register as a Campus Placement Officer.';
    }

    groupName?.classList.remove('hidden');
    groupCollege?.classList.remove('hidden');

    if (nameInput) {
      nameInput.placeholder = currentRole === 'Student' ? 'e.g. Alexander Wright' : 'e.g. Dr. Robert Vance';
    }

    if (currentRole === 'Student') {
      groupStudentFields?.classList.remove('hidden');
    } else {
      groupStudentFields?.classList.add('hidden');
    }

    groupConfirmPass?.classList.remove('hidden');
    rowForgotPass?.classList.add('hidden');

    if (submitBtn) {
      submitBtn.innerHTML = currentRole === 'Student'
        ? `Create Student Account & Send OTP <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`
        : `Register TPO Account & Send OTP <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
    }

    if (promptEl) promptEl.innerText = "Already have an account?";
    if (switchBtn) switchBtn.innerText = "Sign In";
  }
}

export async function handleAuthFormSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();

  if (authMode === 'LOGIN') {
    await handleLoginFlow();
  } else {
    await handleRegistrationFlow();
  }
}

export const handleAuthSubmit = handleAuthFormSubmit;

// Step 1: Login Request (Triggers Email OTP)
async function handleLoginFlow() {
  const email = document.getElementById('auth-email')?.value?.trim()?.toLowerCase();
  const password = document.getElementById('auth-password')?.value || '';

  if (!email || !password) {
    showToast('Please enter both email and password.');
    return;
  }

  showToast(`Authenticating ${currentRole} credentials...`);

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: currentRole })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || 'Login failed. Please check your credentials.');
      return;
    }

    if (data.otpRequired) {
      pendingVerificationEmail = data.email || email;
      pendingVerificationRole = data.role || currentRole;
      pendingAuthMode = 'LOGIN';

      setupVerificationUI(pendingVerificationEmail, pendingVerificationRole, 'LOGIN');
      showToast(data.message || `A 6-digit verification code has been dispatched to ${pendingVerificationEmail}.`);
    }

  } catch (err) {
    console.error('Login network error:', err);
    showToast('Unable to connect to authentication server. Please ensure server is running.');
  }
}

// Step 1: Registration Request (Triggers Email OTP)
async function handleRegistrationFlow() {
  const name = document.getElementById('auth-name')?.value?.trim();
  const email = document.getElementById('auth-email')?.value?.trim();
  const college = document.getElementById('auth-college')?.value?.trim();
  const branch = document.getElementById('auth-branch')?.value || 'Computer Science & Engineering';
  const year = document.getElementById('auth-year')?.value || '2026';
  const password = document.getElementById('auth-password')?.value || '';
  const confirmPassword = document.getElementById('auth-confirm-password')?.value || '';

  if (!name) {
    showToast('Please enter your full name.');
    return;
  }
  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast('Please enter a valid email address.');
    return;
  }
  if (!college) {
    showToast('Please enter your college or university name.');
    return;
  }

  const strCheck = checkPasswordStrength(password);
  if (!strCheck.valid) {
    showToast(`Weak Password! ${strCheck.message}`);
    return;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match. Please confirm your password.');
    return;
  }

  showToast(`Registering ${currentRole} profile and dispatching OTP...`);

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        college,
        branch: currentRole === 'Student' ? branch : 'Placement Cell',
        year: currentRole === 'Student' ? year : 'Admin',
        password,
        role: currentRole
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || 'Registration failed. Please try again.');
      return;
    }

    pendingVerificationEmail = (data.email || email).toLowerCase().trim();
    pendingVerificationRole = data.role || currentRole;
    pendingAuthMode = 'REGISTER';

    setupVerificationUI(pendingVerificationEmail, pendingVerificationRole, 'REGISTER');
    showToast(data.message || `Verification code dispatched to ${pendingVerificationEmail}.`);

  } catch (err) {
    console.error('Registration network error:', err);
    showToast('Unable to connect to authentication server. Please ensure server is running.');
  }
}

// Configures the OTP Verification Screen specifically for Student or TPO
function setupVerificationUI(email, role, mode) {
  const isTpo = role === 'TPO';
  const badgeEl = document.getElementById('auth-verify-role-badge');
  const titleEl = document.getElementById('auth-verify-title');
  const subtitleEl = document.getElementById('auth-verify-subtitle');
  const targetEl = document.getElementById('verify-email-target');
  const codeInput = document.getElementById('auth-verify-code');
  const submitBtn = document.getElementById('auth-verify-submit-btn');

  if (badgeEl) {
    badgeEl.innerHTML = isTpo
      ? `<span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 11px; letter-spacing: 0.5px; border: 1px solid #fcd34d;">🛡️ TPO ADMINISTRATIVE AUTHORIZATION</span>`
      : `<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 11px; letter-spacing: 0.5px; border: 1px solid #bfdbfe;">🎓 STUDENT ACCESS VERIFICATION</span>`;
  }

  if (titleEl) {
    titleEl.innerText = isTpo ? 'TPO Officer Authorization' : 'Verify Your Email';
  }

  if (subtitleEl) {
    subtitleEl.innerHTML = `A 6-digit confirmation code was sent to: <br><strong id="verify-email-target" style="color: var(--primary-accent); word-break: break-all;">${email}</strong><br><span style="font-size: 12px; color: var(--text-muted); display: block; margin-top: 6px;">Check your email inbox or spam folder. Enter the code below to proceed.</span>`;
  } else if (targetEl) {
    targetEl.innerText = email;
  }

  if (codeInput) {
    codeInput.value = ''; // MUST ALWAYS BE BLANK - never prefill or expose OTP on the page
  }

  if (submitBtn) {
    submitBtn.innerText = isTpo ? 'Authorize Officer Sign In →' : 'Verify & Enter Portal →';
  }

  document.getElementById('auth-main-card')?.classList.add('hidden');
  document.getElementById('auth-verify-card')?.classList.remove('hidden');
}

// Step 2: Verify OTP and Enter Portal
export async function verifyEmailCode(event) {
  if (event && event.preventDefault) event.preventDefault();

  const codeInput = document.getElementById('auth-verify-code')?.value?.trim();
  if (!codeInput || codeInput.length !== 6) {
    showToast('Please enter the complete 6-digit verification code from your email.');
    return;
  }

  showToast('Verifying code...');

  const endpoint = pendingAuthMode === 'LOGIN' 
    ? `${API_BASE_URL}/api/auth/verify-login-otp` 
    : `${API_BASE_URL}/api/auth/verify-email`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: pendingVerificationEmail,
        otp: codeInput,
        role: pendingVerificationRole
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.verified) {
      showToast(data.message || 'Invalid or expired verification code. Please check your email inbox.');
      return;
    }

    // Success -> Store authenticated user and token
    state.currentUser = data.user;
    if (data.token) {
      sessionStorage.setItem('careernova_auth_token', data.token);
    }

    applyUserToUI(state.currentUser);

    document.getElementById('auth-view')?.classList.add('hidden');
    document.getElementById('app-shell')?.classList.remove('hidden');

    backToLogin(); // Reset form state for future signouts

    if (state.currentUser.role === 'Student') {
      if (typeof updateGaugeVisual === 'function') updateGaugeVisual(state.currentScore || 0);
      if (typeof switchView === 'function') switchView('dashboard');
      showToast(`Welcome back, ${state.currentUser.name}!`);
    } else {
      if (typeof switchView === 'function') switchView('college');
      showToast(`Welcome, ${state.currentUser.name} (TPO Portal Authorized)`);
    }

  } catch (err) {
    console.error('Verification error:', err);
    showToast('Connection error during verification. Please check server status.');
  }
}

export async function resendVerificationCode() {
  if (!pendingVerificationEmail) {
    showToast('No pending verification session found. Please sign in or register first.');
    return;
  }

  showToast('Requesting a fresh verification code...');

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: pendingVerificationEmail,
        role: pendingVerificationRole
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      showToast(data.message || 'Unable to resend verification code.');
      return;
    }

    const codeInput = document.getElementById('auth-verify-code');
    if (codeInput) codeInput.value = ''; // Keep blank for user to enter

    showToast(data.message || `A fresh verification code has been dispatched to ${pendingVerificationEmail}.`);

  } catch (err) {
    console.error('Resend error:', err);
    showToast('Unable to resend verification code. Please check connection.');
  }
}

export function showForgotPassword() {
  document.getElementById('auth-main-card')?.classList.add('hidden');
  document.getElementById('auth-verify-card')?.classList.add('hidden');
  document.getElementById('auth-forgot-card')?.classList.remove('hidden');

  document.getElementById('forgot-step-1')?.classList.remove('hidden');
  document.getElementById('forgot-step-2')?.classList.add('hidden');
  document.getElementById('forgot-step-3')?.classList.add('hidden');

  const subtitle = document.getElementById('forgot-subtitle');
  if (subtitle) {
    subtitle.innerText = `Step 1: Enter your registered ${currentRole} email address to receive a recovery code.`;
  }
}

export async function sendPasswordResetCode(event) {
  if (event && event.preventDefault) event.preventDefault();

  const email = document.getElementById('auth-forgot-email')?.value?.trim();
  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast('Please enter a valid registered email address.');
    return;
  }

  showToast('Sending password reset code...');

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role: currentRole })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || 'Unable to send password reset code.');
      return;
    }

    pendingVerificationEmail = email.toLowerCase().trim();
    pendingVerificationRole = currentRole;

    const resetInput = document.getElementById('auth-reset-code');
    if (resetInput) resetInput.value = '';

    document.getElementById('forgot-step-1')?.classList.add('hidden');
    document.getElementById('forgot-step-2')?.classList.remove('hidden');

    const subtitle = document.getElementById('forgot-subtitle');
    if (subtitle) subtitle.innerText = `Step 2: Enter the 6-digit recovery code sent to ${pendingVerificationEmail}.`;

    showToast(data.message || `Password recovery code dispatched to ${pendingVerificationEmail}.`);

  } catch (err) {
    console.error('Forgot password error:', err);
    showToast('Server error requesting password reset.');
  }
}

export async function verifyResetCode(event) {
  if (event && event.preventDefault) event.preventDefault();

  const code = document.getElementById('auth-reset-code')?.value?.trim();
  if (!code || code.length !== 6) {
    showToast('Please enter the 6-digit reset code.');
    return;
  }

  showToast('Verifying recovery code...');

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: pendingVerificationEmail,
        otp: code,
        role: pendingVerificationRole
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.verified) {
      showToast(data.message || 'Invalid or expired recovery code. Please check your email.');
      return;
    }

    pendingResetToken = data.resetToken;

    document.getElementById('forgot-step-2')?.classList.add('hidden');
    document.getElementById('forgot-step-3')?.classList.remove('hidden');

    const subtitle = document.getElementById('forgot-subtitle');
    if (subtitle) subtitle.innerText = 'Step 3: Create a strong new password.';

    showToast('Code verified! Enter your new password.');

  } catch (err) {
    console.error('Verify reset code error:', err);
    showToast('Server error verifying reset code.');
  }
}

export async function saveNewPassword(event) {
  if (event && event.preventDefault) event.preventDefault();

  const newPass = document.getElementById('auth-new-password')?.value || '';
  const confirmPass = document.getElementById('auth-confirm-new-password')?.value || '';

  const strCheck = checkPasswordStrength(newPass);
  if (!strCheck.valid) {
    showToast(`Weak Password! ${strCheck.message}`);
    return;
  }
  if (newPass !== confirmPass) {
    showToast('Passwords do not match. Please confirm your new password.');
    return;
  }

  showToast('Updating password...');

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: pendingVerificationEmail,
        resetToken: pendingResetToken,
        newPassword: newPass
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      showToast(data.message || 'Unable to update password. Please try again.');
      return;
    }

    showToast('Password updated successfully! Please sign in with your new password.');
    backToLogin();

  } catch (err) {
    console.error('Save password error:', err);
    showToast('Server error resetting password.');
  }
}

export function backToLogin() {
  document.getElementById('auth-verify-card')?.classList.add('hidden');
  document.getElementById('auth-forgot-card')?.classList.add('hidden');
  document.getElementById('auth-main-card')?.classList.remove('hidden');

  authMode = 'LOGIN';
  updateFormUIForCurrentState();

  // Clear inputs
  const codeEl = document.getElementById('auth-verify-code');
  if (codeEl) codeEl.value = '';

  const forgotEmail = document.getElementById('auth-forgot-email');
  if (forgotEmail) forgotEmail.value = '';

  const resetCode = document.getElementById('auth-reset-code');
  if (resetCode) resetCode.value = '';

  const newPass = document.getElementById('auth-new-password');
  if (newPass) newPass.value = '';

  const confirmNewPass = document.getElementById('auth-confirm-new-password');
  if (confirmNewPass) confirmNewPass.value = '';

  const hintEl = document.getElementById('password-strength-hint');
  if (hintEl) hintEl.innerText = '';
}

export function handleSignOut() {
  state.currentUser = null;
  sessionStorage.removeItem('careernova_auth_token');

  document.getElementById('app-shell')?.classList.add('hidden');
  document.getElementById('auth-view')?.classList.remove('hidden');
  backToLogin();
  showToast('Signed out successfully.');
}

/**
 * Updates UI based on authenticated user:
 * - If STUDENT:
 *   - Shows Candidate tools (Dashboard, DSA, Top Tech Apps, Tracker, Hackathons, AI Chat, Jobs)
 *   - COMPLETELY HIDES TPO PORTAL
 * - If TPO OFFICER:
 *   - Hides Candidate tools (DSA, Tracker, Applications, AI Coach)
 *   - Shows ONLY necessary TPO items (Placement Roster & Analytics, Campus Drives, Job Postings)
 */
export function applyUserToUI(user) {
  if (!user) return;

  const isStudent = user.role === 'Student';
  const isTpo = user.role === 'TPO';

  // 1. Sidebar User Profile Summary
  const nameEl = document.getElementById('sidebar-user-name');
  if (nameEl) nameEl.innerText = user.name;

  const roleEl = document.getElementById('sidebar-user-role');
  if (roleEl) {
    roleEl.innerText = isTpo 
      ? 'Placement Officer' 
      : `${(user.college || '').split(' ')[0]} • ${user.branch ? user.branch.split(' ')[0] : 'CS'} '${(user.year || '26').slice(-2)}`;
  }

  const initials = isTpo
    ? 'TP'
    : (user.name || '').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'ST';
  
  const avatarEl = document.getElementById('sidebar-user-avatar');
  if (avatarEl) {
    avatarEl.innerText = initials;
    avatarEl.style.background = isTpo ? 'linear-gradient(135deg, #b45309, #d97706)' : 'linear-gradient(135deg, #1e3a8a, #2563eb)';
  }

  const heroNameEl = document.getElementById('hero-student-name');
  if (heroNameEl) heroNameEl.innerText = isTpo ? 'TPO Officer' : user.name;

  const heroSubEl = document.getElementById('hero-profile-subtitle');
  if (heroSubEl) {
    heroSubEl.innerText = isTpo
      ? `${user.college} TPO Office • Campus Placement Coordinator`
      : `${user.college} • ${user.branch} '${(user.year || '').slice(-2)}`;
  }

  // 2. Navigation Item Elements
  const navCandidateCat = document.getElementById('nav-category-candidate');
  const navDashboard = document.getElementById('nav-item-dashboard');
  const navDsa = document.getElementById('nav-item-dsa');
  const navApplications = document.getElementById('nav-item-applications');
  const navAppTracker = document.getElementById('nav-item-app-tracker');
  const navToolsCat = document.getElementById('nav-category-tools');
  const navAichat = document.getElementById('nav-item-aichat');

  const navTpoCat = document.getElementById('nav-category-tpo');
  const navCollege = document.getElementById('nav-item-college');

  const navTextHackathons = document.getElementById('nav-text-hackathons');
  const navTextJobs = document.getElementById('nav-text-jobs');

  if (isStudent) {
    // STUDENT VIEW: Show candidate navigation
    navCandidateCat?.classList.remove('hidden');
    navDashboard?.classList.remove('hidden');
    navDsa?.classList.remove('hidden');
    navApplications?.classList.remove('hidden');
    navAppTracker?.classList.remove('hidden');
    navToolsCat?.classList.remove('hidden');
    navAichat?.classList.remove('hidden');

    if (navTextHackathons) navTextHackathons.innerText = 'Hackathons & Drives';
    if (navTextJobs) navTextJobs.innerText = 'Verified Job Postings';

    // CRITICAL REQUIREMENT: HIDE TPO COMPLETELY FROM STUDENT PORTAL
    navTpoCat?.classList.add('hidden');
    if (navCollege) {
      navCollege.classList.add('hidden');
      navCollege.style.display = 'none';
    }

  } else if (isTpo) {
    // TPO VIEW: Hide candidate preparation tools, show only necessary administrative tools
    navCandidateCat?.classList.add('hidden');
    navDashboard?.classList.add('hidden');
    navDsa?.classList.add('hidden');
    navApplications?.classList.add('hidden');
    navAppTracker?.classList.add('hidden');
    navToolsCat?.classList.add('hidden');
    navAichat?.classList.add('hidden');

    // Show TPO tools
    navTpoCat?.classList.remove('hidden');
    if (navCollege) {
      navCollege.classList.remove('hidden');
      navCollege.style.display = 'flex';
    }

    if (navTextHackathons) navTextHackathons.innerText = 'Campus Recruitment Drives 🔥';
    if (navTextJobs) navTextJobs.innerText = 'Corporate Job Postings 💼';
  }
}
