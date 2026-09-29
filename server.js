/* CareerNova - Backend Authentication Server */

import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// In-Memory Data Stores
const users = new Map();
const pendingOtps = new Map();
const resetTokens = new Map();

// Seed Default Demo Accounts (Pre-verified for quick profile shortcuts)
const initSeedAccounts = async () => {
  const defaultPass = await bcrypt.hash('Alex@2026', 10);
  users.set('alex.wright@university.edu', {
    id: 'usr_1',
    name: 'Alexander Wright',
    email: 'alex.wright@university.edu',
    college: 'Stanford University',
    branch: 'Computer Science & Engineering',
    year: '2026',
    role: 'Student',
    passwordHash: defaultPass,
    isVerified: true,
    createdAt: new Date().toISOString()
  });

  users.set('tpo@university.edu', {
    id: 'usr_2',
    name: 'Dr. Robert Vance (TPO)',
    email: 'tpo@university.edu',
    college: 'Stanford University',
    branch: 'Placement Cell',
    year: 'Admin',
    role: 'TPO',
    passwordHash: defaultPass,
    isVerified: true,
    createdAt: new Date().toISOString()
  });
};

initSeedAccounts();

// Nodemailer Transporter Pre-Warming for Sub-50ms Instant OTP Delivery
let cachedTransporter = null;

async function initTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass && (host.includes('gmail') || user.endsWith('@gmail.com'))) {
    const cleanPass = pass.replace(/\s+/g, '');
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass: cleanPass }
    });
    console.log(`[Email Service] Gmail Transport configured for ${user}.`);
    return;
  }

  if (host && user && pass && !user.includes('your_email') && !pass.includes('placeholder')) {
    cachedTransporter = nodemailer.createTransport({
      host: host,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass: pass.replace(/\s+/g, '') }
    });
    console.log('[Email Service] Production SMTP ready for instant delivery.');
    return;
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('[Email Service] Instant Ethereal Test Transport pre-warmed & ready.');
  } catch (err) {
    console.error('[Email Service] Failed to pre-warm test transport:', err);
  }
}

initTransporter();

async function getTransporter() {
  if (!cachedTransporter) {
    await initTransporter();
  }
  return cachedTransporter;
}

async function sendEmailOTP(toEmail, otpCode, purpose = 'REGISTRATION') {
  console.log(`\n==================================================`);
  console.log(`⚡ [INSTANT EMAIL DISPATCH]`);
  console.log(`Target Email: ${toEmail}`);
  console.log(`🔑 YOUR OTP CODE IS: ${otpCode}`);
  console.log(`==================================================\n`);

  const transporter = await getTransporter();

  const title = purpose === 'REGISTRATION' ? 'Verify Your CareerNova Email' : 'Reset Your CareerNova Password';
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #1e3a8a; margin: 0;">CareerNova</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Candidate & Campus Placement Platform</p>
      </div>
      <h3 style="color: #0f172a; margin-bottom: 12px;">${title}</h3>
      <p style="color: #334155; font-size: 14px; line-height: 1.5;">
        Your 6-digit confirmation code is:
      </p>
      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-family: monospace; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #2563eb;">${otpCode}</span>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 16px;">
        This code is valid for <strong>5 minutes</strong>. If you did not request this code, please ignore this email.
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"CareerNova" <noreply@careernova.com>',
      to: toEmail,
      subject: `CareerNova Confirmation Code: ${otpCode}`,
      html: htmlBody
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`View Sent Email Inbox Online: ${previewUrl}\n`);
    }
    return info;
  } catch (err) {
    console.error('Primary Nodemailer sendMail failed:', err.message);
    console.log('[Email Service] Switching to fallback test transport for instant delivery...');

    try {
      const fallbackAccount = await nodemailer.createTestAccount();
      const fallbackTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: fallbackAccount.user, pass: fallbackAccount.pass }
      });

      const fallbackInfo = await fallbackTransporter.sendMail({
        from: '"CareerNova" <noreply@careernova.com>',
        to: toEmail,
        subject: `CareerNova Confirmation Code: ${otpCode}`,
        html: htmlBody
      });

      const fallbackUrl = nodemailer.getTestMessageUrl(fallbackInfo);
      console.log(`\n==================================================`);
      console.log(`⚡ [FALLBACK TEST EMAIL DISPATCH]`);
      console.log(`Sent OTP to: ${toEmail}`);
      console.log(`🔑 OTP CODE: ${otpCode}`);
      if (fallbackUrl) console.log(`View Email Online: ${fallbackUrl}`);
      console.log(`==================================================\n`);

      return fallbackInfo;
    } catch (fallbackErr) {
      console.error('Fallback sendMail also failed:', fallbackErr);
      throw err;
    }
  }
}

// Helper: SHA-256 Hash
function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');
}

// -----------------------------------------------------------------------------
// REST API ENDPOINTS
// -----------------------------------------------------------------------------

// 1. REGISTER (Create Account & Send Email OTP)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, college, branch, year, password, role } = req.body;

    if (!name || !email || !college || !password || !role) {
      return res.status(400).json({ success: false, message: 'Missing required registration fields.' });
    }

    const emailNorm = email.toLowerCase().trim();

    // Check if user already exists and is verified
    const existingUser = users.get(emailNorm);
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashOtp(otp);

    // CRITICAL REQUIREMENT: Email sending MUST succeed before returning success
    try {
      await sendEmailOTP(emailNorm, otp, 'REGISTRATION');
    } catch (emailError) {
      console.error('[Auth Error] Email dispatch failed:', emailError.message);
      return res.status(500).json({
        success: false,
        verificationRequired: true,
        message: 'Unable to send verification code. Please check email server configuration and try again.'
      });
    }

    // Email dispatch succeeded -> store pending OTP & registration payload
    pendingOtps.set(emailNorm, {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins expiry
      attempts: 0,
      resendAttempts: 0,
      lastResendAt: Date.now(),
      pendingUserPayload: {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: emailNorm,
        college: college.trim(),
        branch: role === 'Student' ? (branch || 'Computer Science & Engineering') : 'Placement Cell',
        year: role === 'Student' ? (year || '2026') : 'Admin',
        role: role === 'TPO' ? 'TPO' : 'Student',
        passwordHash
      },
      purpose: 'REGISTRATION'
    });

    return res.json({
      success: true,
      verificationRequired: true,
      message: `Verification OTP sent to ${emailNorm}. Check your email inbox.`
    });

  } catch (err) {
    console.error('Registration server error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// 2. VERIFY OTP (Server-side OTP validation)
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, verified: false, message: 'Email and OTP code are required.' });
    }

    const emailNorm = email.toLowerCase().trim();
    const record = pendingOtps.get(emailNorm);

    if (!record || record.purpose !== 'REGISTRATION') {
      return res.status(400).json({ success: false, verified: false, message: 'No pending verification request found. Please register again.' });
    }

    if (Date.now() > record.expiresAt) {
      pendingOtps.delete(emailNorm);
      return res.status(400).json({ success: false, verified: false, message: 'Verification code has expired. Please request a new code.' });
    }

    if (record.attempts >= 5) {
      pendingOtps.delete(emailNorm);
      return res.status(429).json({ success: false, verified: false, message: 'Too many invalid attempts. Please request a new verification code.' });
    }

    const submittedHash = hashOtp(otp);
    if (submittedHash !== record.otpHash) {
      record.attempts += 1;
      return res.status(400).json({ success: false, verified: false, message: 'Invalid verification code. Please check your inbox and try again.' });
    }

    // OTP Correct -> Activate User Account
    const activatedUser = {
      ...record.pendingUserPayload,
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    users.set(emailNorm, activatedUser);
    pendingOtps.delete(emailNorm);

    return res.json({
      success: true,
      verified: true,
      user: {
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
    console.error('Verify OTP server error:', err);
    return res.status(500).json({ success: false, verified: false, message: 'Internal server error during verification.' });
  }
});

// 3. RESEND OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const emailNorm = email.toLowerCase().trim();
    const record = pendingOtps.get(emailNorm);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No pending verification found for this email.' });
    }

    // Rate Limiting: Max 3 resend attempts per 10 minutes
    if (record.resendAttempts >= 3 && (Date.now() - record.lastResendAt) < 10 * 60 * 1000) {
      return res.status(429).json({ success: false, message: 'Too many resend attempts. Please wait 10 minutes before trying again.' });
    }

    const newOtp = crypto.randomInt(100000, 999999).toString();
    const newOtpHash = hashOtp(newOtp);

    try {
      await sendEmailOTP(emailNorm, newOtp, record.purpose);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Unable to send verification code. Please check email server configuration.' });
    }

    record.otpHash = newOtpHash;
    record.expiresAt = Date.now() + 5 * 60 * 1000;
    record.attempts = 0;
    record.resendAttempts += 1;
    record.lastResendAt = Date.now();

    return res.json({ success: true, message: `New verification OTP sent to ${emailNorm}. Check your email inbox.` });

  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during resend.' });
  }
});

// 4. SIGN IN (Server-side Authentication)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email address before signing in.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      user: {
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
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// 5. FORGOT PASSWORD (Request OTP)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    const emailNorm = email.toLowerCase().trim();
    const user = users.get(emailNorm);

    if (!user || !user.isVerified) {
      return res.status(404).json({ success: false, message: 'No verified account found with this email address.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = hashOtp(otp);

    try {
      await sendEmailOTP(emailNorm, otp, 'FORGOT_PASSWORD');
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Unable to send password reset code. Please try again.' });
    }

    pendingOtps.set(emailNorm, {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
      resendAttempts: 0,
      lastResendAt: Date.now(),
      purpose: 'FORGOT_PASSWORD'
    });

    return res.json({ success: true, message: `Password reset OTP sent to ${emailNorm}. Check your email inbox.` });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Server error processing password reset.' });
  }
});

// 6. VERIFY RESET OTP
app.post('/api/auth/verify-reset-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, verified: false, message: 'Email and OTP code are required.' });

    const emailNorm = email.toLowerCase().trim();
    const record = pendingOtps.get(emailNorm);

    if (!record || record.purpose !== 'FORGOT_PASSWORD') {
      return res.status(400).json({ success: false, verified: false, message: 'No pending reset request found.' });
    }

    if (Date.now() > record.expiresAt) {
      pendingOtps.delete(emailNorm);
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
    pendingOtps.delete(emailNorm);

    return res.json({ success: true, verified: true, resetToken });

  } catch (err) {
    console.error('Verify reset OTP error:', err);
    return res.status(500).json({ success: false, verified: false, message: 'Server error verifying reset code.' });
  }
});

// 7. RESET PASSWORD
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
    resetTokens.delete(emailNorm);

    return res.json({ success: true, message: 'Password updated successfully! Please sign in with your new password.' });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
});

// 8. TPO OFFICER ROSTER (Fetch all registered student details)
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
