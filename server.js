/* CareerNova - Secure Backend Authentication Server */

import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// In-Memory & File-Persisted Data Stores
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const users = new Map();
const pendingOtps = new Map(); // Key: `${role}:${email}`
const resetTokens = new Map();

function saveUsersToFile() {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const usersArray = Array.from(users.entries());
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersArray, null, 2));
  } catch (err) {
    console.error('Failed to persist users to file:', err);
  }
}

function loadUsersFromFile() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const usersArray = JSON.parse(data);
      for (const [email, userObj] of usersArray) {
        users.set(email.toLowerCase().trim(), userObj);
      }
      console.log(`[Database] Loaded ${users.size} persisted accounts from users.json`);
    }
  } catch (err) {
    console.error('Failed to load users from file:', err);
  }
}

// Seed Initial Accounts (Pre-verified for instant access)
const initSeedAccounts = async () => {
  loadUsersFromFile();

  const alexPass = await bcrypt.hash('Alex@2026', 10);
  const sarvoPass = await bcrypt.hash('Sarvo@123', 10);

  if (!users.has('alex.wright@university.edu')) {
    users.set('alex.wright@university.edu', {
      id: 'usr_1',
      name: 'Alexander Wright',
      email: 'alex.wright@university.edu',
      college: 'Stanford University',
      branch: 'Computer Science & Engineering',
      year: '2026',
      role: 'Student',
      passwordHash: alexPass,
      isVerified: true,
      createdAt: new Date().toISOString()
    });
  }

  if (!users.has('tpo@university.edu')) {
    users.set('tpo@university.edu', {
      id: 'usr_2',
      name: 'Dr. Robert Vance',
      email: 'tpo@university.edu',
      college: 'Stanford University',
      branch: 'Placement Cell',
      year: 'Admin',
      role: 'TPO',
      passwordHash: alexPass,
      isVerified: true,
      createdAt: new Date().toISOString()
    });
  }

  if (!users.has('sarvagya.anand070@gmail.com')) {
    users.set('sarvagya.anand070@gmail.com', {
      id: 'usr_3',
      name: 'Sarvagya Anand',
      email: 'sarvagya.anand070@gmail.com',
      college: 'VIT Bhopal University',
      branch: 'Computer Science & Engineering',
      year: '2026',
      role: 'Student',
      passwordHash: sarvoPass,
      isVerified: true,
      createdAt: new Date().toISOString()
    });
  }

  saveUsersToFile();
};

initSeedAccounts();

// Nodemailer Transporter Pre-Warming
let cachedTransporter = null;
let transporterPromise = null;

async function initTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const isPlaceholder = !user || !pass || 
    user.includes('your_') || 
    pass.includes('your_') || 
    user.includes('placeholder') || 
    pass.includes('placeholder');

  if (!isPlaceholder && user && pass && (host?.includes('gmail') || user.endsWith('@gmail.com'))) {
    const cleanPass = pass.replace(/\s+/g, '');
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass: cleanPass },
      tls: { rejectUnauthorized: false }
    });
    console.log(`\n==================================================`);
    console.log(`[Email Service] LIVE GMAIL TRANSPORT ACTIVE for ${user}`);
    console.log(`Real OTP emails will be delivered directly to inboxes!`);
    console.log(`==================================================\n`);
    return cachedTransporter;
  }

  if (!isPlaceholder && host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host: host,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass: pass.replace(/\s+/g, '') },
      tls: { rejectUnauthorized: false }
    });
    console.log(`\n==================================================`);
    console.log(`[Email Service] LIVE SMTP TRANSPORT ACTIVE for ${user}`);
    console.log(`Real OTP emails will be delivered directly to inboxes!`);
    console.log(`==================================================\n`);
    return cachedTransporter;
  }

  console.log(`\n==================================================`);
  console.log(`[Email Service] NOTICE: Running in TEST / SANDBOX MODE.`);
  console.log(`No live Gmail SMTP credentials configured in .env.`);
  console.log(`OTPs are logged below in this terminal & in Ethereal preview links.`);
  console.log(`To receive real emails in your personal inbox, add your Gmail App Password to .env.`);
  console.log(`==================================================\n`);

  try {
    const testAccount = await Promise.race([
      nodemailer.createTestAccount(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Ethereal connection timeout')), 3000))
    ]);
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log('[Email Service] Instant Ethereal Test Transport pre-warmed & ready.');
  } catch (err) {
    console.log('[Email Service] Activating instant local secure transport for development.');
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true
    });
  }

  return cachedTransporter;
}

function getTransporter() {
  if (cachedTransporter) return Promise.resolve(cachedTransporter);
  if (!transporterPromise) {
    transporterPromise = initTransporter();
  }
  return transporterPromise;
}

initTransporter();

// Helper: SHA-256 Hash for OTP storage
function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');
}

// Generate OTP Key: role + email ensures complete separation between Student and TPO
function getOtpKey(role, email) {
  const r = (role || 'Student').toUpperCase().trim();
  const e = (email || '').toLowerCase().trim();
  return `${r}:${e}`;
}

// Send Role-Specific Email OTP (Student vs TPO)
async function sendEmailOTP(toEmail, otpCode, purpose = 'LOGIN', role = 'Student', recipientName = '') {
  const isTpo = role === 'TPO';
  const roleTitle = isTpo ? 'TPO Officer Portal' : 'Student Placement Portal';

  console.log(`\n==================================================`);
  console.log(`⚡ [SECURE EMAIL OTP DISPATCH]`);
  console.log(`Target: ${toEmail} | Role: ${role} | Purpose: ${purpose}`);
  console.log(`🔑 DISPATCHED OTP CODE: ${otpCode}`);
  console.log(`==================================================\n`);

  const transporter = await getTransporter();

  let subject = '';
  let headline = '';
  let purposeDescription = '';
  let badgeHtml = '';
  let headerColor = isTpo ? '#0f172a' : '#1e3a8a';
  let accentColor = isTpo ? '#d97706' : '#2563eb';
  let boxBg = isTpo ? '#fffbeb' : '#eff6ff';
  let boxBorder = isTpo ? '#fde68a' : '#bfdbfe';

  if (isTpo) {
    badgeHtml = `<span style="background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px; letter-spacing: 1px; border: 1px solid #fcd34d;">ADMINISTRATIVE OFFICER ACCESS</span>`;
    if (purpose === 'LOGIN') {
      subject = `🛡️ [RESTRICTED] CareerNova TPO Administrative Security Code: ${otpCode}`;
      headline = 'TPO Officer Login Authorization';
      purposeDescription = `Official Notice: An administrative sign-in was initiated for your Campus Placement Officer account. Enter this one-time passcode to authorize access to institutional placement rosters and candidate metrics.`;
    } else if (purpose === 'REGISTRATION') {
      subject = `🛡️ [RESTRICTED] CareerNova TPO Profile Verification: ${otpCode}`;
      headline = 'TPO Coordinator Account Verification';
      purposeDescription = `Official Notice: Verify your institutional placement cell credentials to activate your Campus Placement Officer account.`;
    } else {
      subject = `🛡️ [RESTRICTED] CareerNova TPO Password Recovery: ${otpCode}`;
      headline = 'TPO Administrative Password Reset';
      purposeDescription = `An administrative password reset was requested. Enter this security code to verify your authorization.`;
    }
  } else {
    badgeHtml = `<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px; letter-spacing: 1px; border: 1px solid #bfdbfe;">STUDENT ACCESS CODE</span>`;
    if (purpose === 'LOGIN') {
      subject = `🎓 [CareerNova Student Portal] Your Verification Code: ${otpCode}`;
      headline = 'Student Sign In Verification';
      purposeDescription = `Hello ${recipientName || 'Candidate'}, you requested to sign in to your CareerNova Student Dashboard. Enter this verification code to access your placement preparation, DSA tracker, and job applications.`;
    } else if (purpose === 'REGISTRATION') {
      subject = `🎓 [CareerNova Student Portal] Welcome! Verify Your Email: ${otpCode}`;
      headline = 'Student Account Email Verification';
      purposeDescription = `Welcome to CareerNova! Verify your student email to activate your candidate placement account, problem-solving streak, and resume tracker.`;
    } else {
      subject = `🎓 [CareerNova Student Portal] Password Reset Code: ${otpCode}`;
      headline = 'Student Password Reset';
      purposeDescription = `You requested to reset your password. Enter this verification code to confirm your identity and choose a new password.`;
    }
  }

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; overflow: hidden;">
      <div style="background: ${headerColor}; padding: 24px; text-align: center; border-bottom: 3px solid ${accentColor};">
        <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">CareerNova</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 12px 0;">${roleTitle}</p>
        <div>${badgeHtml}</div>
      </div>
      
      <div style="padding: 28px 24px;">
        <h3 style="color: #0f172a; margin: 0 0 12px 0; font-size: 18px;">${headline}</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          ${purposeDescription}
        </p>

        <div style="background: ${boxBg}; border: 1px solid ${boxBorder}; padding: 20px; border-radius: 10px; text-align: center; margin: 24px 0;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px; text-transform: uppercase;">One-Time Passcode (OTP)</div>
          <span style="font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: ${accentColor};">${otpCode}</span>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
          ⏱️ This code is valid for <strong>5 minutes</strong>. If you did not initiate this request, you can safely ignore this email.
        </p>
      </div>

      <div style="background: #f8fafc; padding: 16px 24px; border-top: 1px solid #f1f5f9; text-align: center;">
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          CareerNova Secure Placement System • Protected by 256-Bit Encrypted Multi-Factor Authentication
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || (isTpo ? '"CareerNova TPO Cell" <noreply@careernova.com>' : '"CareerNova Student" <noreply@careernova.com>'),
      to: toEmail,
      subject,
      html: htmlBody
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Preview Mail Online]: ${previewUrl}\n`);
    }
    return info;
  } catch (err) {
    console.error('Primary Nodemailer sendMail error:', err.message);
    try {
      const fallbackAccount = await nodemailer.createTestAccount();
      const fallbackTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: fallbackAccount.user, pass: fallbackAccount.pass },
        tls: { rejectUnauthorized: false }
      });

      const fallbackInfo = await fallbackTransporter.sendMail({
        from: '"CareerNova Security" <noreply@careernova.com>',
        to: toEmail,
        subject,
        html: htmlBody
      });

      const fallbackUrl = nodemailer.getTestMessageUrl(fallbackInfo);
      if (fallbackUrl) {
        console.log(`[Fallback Test Email Online]: ${fallbackUrl}\n`);
      }
      return fallbackInfo;
    } catch (fbErr) {
      console.log('[Email Service] Ethereal delivery bypassed, using instant JSON stream transport.');
      const localTransporter = nodemailer.createTransport({ jsonTransport: true });
      return await localTransporter.sendMail({
        from: '"CareerNova Security" <noreply@careernova.com>',
        to: toEmail,
        subject,
        html: htmlBody
      });
    }
  }
}

// -----------------------------------------------------------------------------
// REST API ENDPOINTS
// -----------------------------------------------------------------------------

// 1. SIGN IN (Step 1: Validate Credentials & Send Role-Specific Email OTP)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const emailNorm = email.toLowerCase().trim();
    const targetRole = role === 'TPO' ? 'TPO' : 'Student';
    const user = users.get(emailNorm);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Account not found for ${emailNorm}. Please click "Create Account" below to register.`
      });
    }

    // Role Enforcement: Ensure Student cannot login on TPO tab and vice versa
    if (user.role !== targetRole) {
      return res.status(403).json({
        success: false,
        message: `Role mismatch: This account is registered as a ${user.role}. Please switch to the ${user.role} tab to sign in.`
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending verification. Please complete registration verification first.'
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your credentials or click "Forgot Password".'
      });
    }

    // Generate 6-digit OTP specifically for Login
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashOtp(otp);
    const otpKey = getOtpKey(targetRole, emailNorm);

    // Send Role-Specific OTP to user's email only
    try {
      await sendEmailOTP(emailNorm, otp, 'LOGIN', targetRole, user.name);
    } catch (emailErr) {
      console.error('[Login OTP Error] Failed to send email:', emailErr);
      return res.status(500).json({
        success: false,
        message: 'Failed to dispatch verification email. Please check internet connection or server settings.'
      });
    }

    // Save pending login OTP with 5 minute expiration
    pendingOtps.set(otpKey, {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      resendAttempts: 0,
      lastResendAt: Date.now(),
      purpose: 'LOGIN',
      role: targetRole,
      userId: user.id
    });

    // NOTE: OTP code is NEVER sent to browser client response
    return res.json({
      success: true,
      otpRequired: true,
      email: emailNorm,
      role: targetRole,
      message: `A 6-digit verification code has been dispatched to ${emailNorm}. Please check your email inbox.`
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// 2. VERIFY LOGIN OTP (Step 2: Validate OTP & Issue Authenticated Session)
app.post('/api/auth/verify-login-otp', (req, res) => {
  try {
    const { email, otp, role } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, verified: false, message: 'Email and verification code are required.' });
    }

    const emailNorm = email.toLowerCase().trim();
    const targetRole = role === 'TPO' ? 'TPO' : 'Student';
    const otpKey = getOtpKey(targetRole, emailNorm);
    const record = pendingOtps.get(otpKey);

    if (!record || record.purpose !== 'LOGIN' || record.role !== targetRole) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'No pending login verification found for this role. Please sign in again.'
      });
    }

    if (Date.now() > record.expiresAt) {
      pendingOtps.delete(otpKey);
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Verification code has expired. Please sign in again to receive a fresh code.'
      });
    }

    if (record.attempts >= 5) {
      pendingOtps.delete(otpKey);
      return res.status(429).json({
        success: false,
        verified: false,
        message: 'Too many incorrect attempts. Please sign in again to receive a new code.'
      });
    }

    const submittedHash = hashOtp(otp);
    if (submittedHash !== record.otpHash) {
      record.attempts += 1;
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid verification code. Please check your email inbox and enter the exact 6 digits.'
      });
    }

    // OTP Verified successfully -> Clear record & issue session token
    pendingOtps.delete(otpKey);
    const user = users.get(emailNorm);

    if (!user) {
      return res.status(404).json({ success: false, verified: false, message: 'User account not found.' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    return res.json({
      success: true,
      verified: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        year: user.year,
        role: user.role,
        loginTime: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('Verify login OTP error:', err);
    return res.status(500).json({ success: false, verified: false, message: 'Internal server error during verification.' });
  }
});

// 3. REGISTER (Create Account & Send Email OTP)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, college, branch, year, password, role } = req.body;

    if (!name || !email || !college || !password) {
      return res.status(400).json({ success: false, message: 'Missing required registration fields.' });
    }

    const emailNorm = email.toLowerCase().trim();
    const targetRole = role === 'TPO' ? 'TPO' : 'Student';

    // Check if user already exists
    const existingUser = users.get(emailNorm);
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: `An account with this email already exists as a ${existingUser.role}. Please sign in.`
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashOtp(otp);
    const otpKey = getOtpKey(targetRole, emailNorm);

    // Send Role-Specific Email OTP
    try {
      await sendEmailOTP(emailNorm, otp, 'REGISTRATION', targetRole, name);
    } catch (emailError) {
      console.error('[Registration Error] Email dispatch failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Unable to dispatch verification email. Please check server connection.'
      });
    }

    pendingOtps.set(otpKey, {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      resendAttempts: 0,
      lastResendAt: Date.now(),
      pendingUserPayload: {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: emailNorm,
        college: college.trim(),
        branch: targetRole === 'Student' ? (branch || 'Computer Science & Engineering') : 'Placement Cell',
        year: targetRole === 'Student' ? (year || '2026') : 'Admin',
        role: targetRole,
        passwordHash
      },
      purpose: 'REGISTRATION',
      role: targetRole
    });

    // NOTE: OTP is NEVER sent to browser client response
    return res.json({
      success: true,
      verificationRequired: true,
      email: emailNorm,
      role: targetRole,
      message: `Verification code sent to ${emailNorm}. Please check your email inbox.`
    });

  } catch (err) {
    console.error('Registration server error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// 4. VERIFY REGISTRATION OTP (Activate User Account)
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { email, otp, role } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, verified: false, message: 'Email and OTP code are required.' });
    }

    const emailNorm = email.toLowerCase().trim();
    const targetRole = role === 'TPO' ? 'TPO' : 'Student';
    const otpKey = getOtpKey(targetRole, emailNorm);
    const record = pendingOtps.get(otpKey);

    if (!record || record.purpose !== 'REGISTRATION' || record.role !== targetRole) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'No pending registration found for this role. Please register again.'
      });
    }

    if (Date.now() > record.expiresAt) {
      pendingOtps.delete(otpKey);
      return res.status(400).json({ success: false, verified: false, message: 'Verification code has expired. Please register again.' });
    }

    if (record.attempts >= 5) {
      pendingOtps.delete(otpKey);
      return res.status(429).json({ success: false, verified: false, message: 'Too many invalid attempts. Please request a new verification code.' });
    }

    const submittedHash = hashOtp(otp);
    if (submittedHash !== record.otpHash) {
      record.attempts += 1;
      return res.status(400).json({ success: false, verified: false, message: 'Invalid verification code. Please check your inbox and try again.' });
    }

    // OTP Correct -> Activate User Account & Save to File
    const activatedUser = {
      ...record.pendingUserPayload,
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    users.set(emailNorm, activatedUser);
    saveUsersToFile();
    pendingOtps.delete(otpKey);

    const token = crypto.randomBytes(32).toString('hex');

    return res.json({
      success: true,
      verified: true,
      token,
      user: {
        id: activatedUser.id,
        name: activatedUser.name,
        email: activatedUser.email,
        college: activatedUser.college,
        branch: activatedUser.branch,
        year: activatedUser.year,
        role: activatedUser.role,
        loginTime: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('Verify registration OTP error:', err);
    return res.status(500).json({ success: false, verified: false, message: 'Internal server error during verification.' });
  }
});

// 5. RESEND OTP (Role-Specific)
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const emailNorm = email.toLowerCase().trim();
    const targetRole = role === 'TPO' ? 'TPO' : 'Student';
    const otpKey = getOtpKey(targetRole, emailNorm);
    const record = pendingOtps.get(otpKey);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No pending verification found for this email address.' });
    }

    // Rate Limiting: Max 4 resend attempts per 10 minutes
    if (record.resendAttempts >= 4 && (Date.now() - record.lastResendAt) < 10 * 60 * 1000) {
      return res.status(429).json({ success: false, message: 'Too many resend attempts. Please wait 10 minutes before requesting again.' });
    }

    const newOtp = crypto.randomInt(100000, 999999).toString();
    const newOtpHash = hashOtp(newOtp);

    const userName = record.pendingUserPayload?.name || users.get(emailNorm)?.name || '';

    try {
      await sendEmailOTP(emailNorm, newOtp, record.purpose, targetRole, userName);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Unable to dispatch verification email.' });
    }

    record.otpHash = newOtpHash;
    record.expiresAt = Date.now() + 5 * 60 * 1000;
    record.attempts = 0;
    record.resendAttempts += 1;
    record.lastResendAt = Date.now();

    // NOTE: OTP is NEVER sent to browser client response
    return res.json({
      success: true,
      message: `A fresh verification code has been dispatched to ${emailNorm}. Please check your email inbox.`
    });

  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during resend.' });
  }
});

// 6. FORGOT PASSWORD (Request OTP)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const emailNorm = email.toLowerCase().trim();
    const targetRole = role === 'TPO' ? 'TPO' : 'Student';
    const user = users.get(emailNorm);

    if (!user || !user.isVerified) {
      return res.status(404).json({ success: false, message: 'No verified account found with this email address.' });
    }

    if (user.role !== targetRole) {
      return res.status(403).json({ success: false, message: `Role mismatch: This account is registered as a ${user.role}.` });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashOtp(otp);
    const otpKey = getOtpKey(targetRole, emailNorm);

    try {
      await sendEmailOTP(emailNorm, otp, 'FORGOT_PASSWORD', targetRole, user.name);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Unable to send password reset code. Please try again.' });
    }

    pendingOtps.set(otpKey, {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      resendAttempts: 0,
      lastResendAt: Date.now(),
      purpose: 'FORGOT_PASSWORD',
      role: targetRole
    });

    return res.json({
      success: true,
      message: `Password reset verification code sent to ${emailNorm}. Check your email inbox.`
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Server error processing password reset.' });
  }
});

// 7. VERIFY RESET OTP
app.post('/api/auth/verify-reset-otp', (req, res) => {
  try {
    const { email, otp, role } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, verified: false, message: 'Email and OTP code are required.' });

    const emailNorm = email.toLowerCase().trim();
    const targetRole = role === 'TPO' ? 'TPO' : 'Student';
    const otpKey = getOtpKey(targetRole, emailNorm);
    const record = pendingOtps.get(otpKey);

    if (!record || record.purpose !== 'FORGOT_PASSWORD') {
      return res.status(400).json({ success: false, verified: false, message: 'No pending reset request found.' });
    }

    if (Date.now() > record.expiresAt) {
      pendingOtps.delete(otpKey);
      return res.status(400).json({ success: false, verified: false, message: 'Reset code expired. Please request a new one.' });
    }

    const submittedHash = hashOtp(otp);
    if (submittedHash !== record.otpHash) {
      record.attempts += 1;
      return res.status(400).json({ success: false, verified: false, message: 'Invalid reset code. Please try again.' });
    }

    // OTP Verified -> Issue Reset Token
    const resetToken = crypto.randomBytes(24).toString('hex');
    resetTokens.set(emailNorm, {
      resetToken,
      expiresAt: Date.now() + 10 * 60 * 1000
    });
    pendingOtps.delete(otpKey);

    return res.json({ success: true, verified: true, resetToken });

  } catch (err) {
    console.error('Verify reset OTP error:', err);
    return res.status(500).json({ success: false, verified: false, message: 'Server error verifying reset code.' });
  }
});

// 8. RESET PASSWORD
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing reset parameters.' });
    }

    const emailNorm = email.toLowerCase().trim();
    const tokenRecord = resetTokens.get(emailNorm);

    if (!tokenRecord || tokenRecord.resetToken !== resetToken || Date.now() > tokenRecord.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset session. Please try again.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const user = users.get(emailNorm);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    saveUsersToFile();
    resetTokens.delete(emailNorm);

    return res.json({ success: true, message: 'Password updated successfully! Please sign in with your new password.' });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
});

// 9. TPO OFFICER ROSTER (Fetch all registered student details)
app.get('/api/tpo/students', (req, res) => {
  try {
    const studentList = [];
    for (const [email, user] of users.entries()) {
      if (user.role === 'Student') {
        studentList.push({
          id: user.id || `usr_${studentList.length + 1}`,
          name: user.name,
          email: user.email,
          college: user.college,
          branch: user.branch || 'Computer Science & Engineering',
          year: user.year || '2026',
          isVerified: !!user.isVerified,
          createdAt: user.createdAt || new Date().toISOString()
        });
      }
    }
    return res.json({ success: true, count: studentList.length, students: studentList });
  } catch (err) {
    console.error('TPO roster fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch student roster.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`CareerNova Server is running on http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
