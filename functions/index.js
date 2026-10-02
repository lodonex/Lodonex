/**
 * Lodonex Cooking Academy - Firebase Cloud Functions
 * Transactional Email Sending Service with Gmail SMTP & Google Cloud Secret Manager
 */

const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Define secrets stored securely in Google Cloud Secret Manager / Firebase Secrets
// Set using: firebase functions:secrets:set GMAIL_APP_PASSWORD
const gmailAppPassword = defineSecret("GMAIL_APP_PASSWORD");
const gmailUserSecret = defineSecret("GMAIL_USER");

const GMAIL_DEFAULT_USER = "lodonexcookingacademy@gmail.com";
const WEBSITE_URL = "https://lodonex.com";

/**
 * Helper to build Nodemailer Transporter using Secret Manager credentials
 */
function getTransporter(user, pass) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Port 465 requires secure: true
    auth: {
      user: user || GMAIL_DEFAULT_USER,
      pass: pass,
    },
  });
}

/**
 * Reusable Core Sender with Firestore Audit Logging
 */
async function sendEmailAndLog({ to, subject, html, text, emailType, user, pass }) {
  const emailId = `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanRecipient = (to || "").trim().toLowerCase();
  const createdAt = admin.firestore.FieldValue.serverTimestamp();

  if (!pass) {
    console.warn(`[GMAIL SECRET WARNING] GMAIL_APP_PASSWORD is not set. Simulating email to ${cleanRecipient}`);
    await db.collection("email_logs").doc(emailId).set({
      emailId,
      recipient: cleanRecipient,
      emailType: emailType || "general",
      subject,
      status: "simulated",
      createdAt,
      sentAt: new Date().toISOString(),
      simulatedNotice: "GMAIL_APP_PASSWORD secret required for live delivery."
    });
    return { success: true, simulated: true, emailId };
  }

  try {
    const transporter = getTransporter(user, pass);
    const info = await transporter.sendMail({
      from: `"Lodonex Cooking Academy" <${user || GMAIL_DEFAULT_USER}>`,
      to: cleanRecipient,
      subject,
      text,
      html,
    });

    await db.collection("email_logs").doc(emailId).set({
      emailId,
      recipient: cleanRecipient,
      emailType: emailType || "general",
      subject,
      status: "sent",
      messageId: info.messageId,
      createdAt,
      sentAt: new Date().toISOString(),
    });

    return { success: true, messageId: info.messageId, emailId };
  } catch (err) {
    console.error(`[GMAIL SMTP ERROR] Failed to send email to ${cleanRecipient}:`, err);
    await db.collection("email_logs").doc(emailId).set({
      emailId,
      recipient: cleanRecipient,
      emailType: emailType || "general",
      subject,
      status: "failed",
      errorMessage: err.message || String(err),
      createdAt,
    });
    return { success: false, error: err.message };
  }
}

/**
 * Branded Lodonex HTML Template Generator
 */
function createEmailHtml({ title, contentHtml, callToAction }) {
  const cta = callToAction
    ? `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" bgcolor="#C8102E" style="border-radius: 2px;">
                  <a href="${callToAction.url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: bold; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 2px;">
                    ${callToAction.text}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E5E0D8; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <tr>
            <td align="center" style="background-color: #111111; padding: 26px 20px; border-bottom: 3px solid #C8102E;">
              <span style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; display: block;">LODONEX</span>
              <span style="font-size: 10px; font-weight: bold; color: #C8102E; letter-spacing: 3px; text-transform: uppercase; display: block; margin-top: 4px;">Lodonex Cooking Academy</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px; color: #222222; font-size: 14px; line-height: 1.65;">
              ${contentHtml}
              ${cta}
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EEEEEE; font-size: 13px; color: #555555;">
                <p style="margin: 0 0 4px 0;">Regards,</p>
                <p style="margin: 0; font-weight: bold; color: #111111;">Lodonex Cooking Academy</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #FDFCF9; padding: 20px 30px; border-top: 1px solid #EAE6DF; text-align: center; font-size: 11px; color: #777777;">
              <p style="margin: 0 0 4px 0;">Lodonex Cooking Academy • Dhaka, Bangladesh</p>
              <p style="margin: 0 0 4px 0;">Website: <a href="https://lodonex.com/" style="color: #C8102E; text-decoration: none; font-weight: bold;">https://lodonex.com/</a> | Email: <a href="mailto:lodonexcookingacademy@gmail.com" style="color: #C8102E;">lodonexcookingacademy@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. Cloud Function: Triggered when a new user document is created in Firestore
 * Sends Student Welcome or Admin Registration Email based on role.
 */
exports.onUserCreated = onDocumentCreated(
  {
    document: "users/{userId}",
    secrets: [gmailAppPassword, gmailUserSecret],
  },
  async (event) => {
    const userData = event.data.data();
    if (!userData || !userData.email) return;

    const email = userData.email;
    const name = userData.name || "Member";
    const role = userData.role || "student";
    const user = gmailUserSecret.value() || GMAIL_DEFAULT_USER;
    const pass = gmailAppPassword.value();

    if (role === "student") {
      // 1. Student Registration Email
      const subject = "Welcome to Lodonex Cooking Academy";
      const contentHtml = `
        <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
        <p style="margin: 0 0 16px 0;">Welcome to <strong>Lodonex Cooking Academy</strong>.</p>
        <p style="margin: 0 0 16px 0;">Your account has been successfully created.</p>
        <p style="margin: 0 0 20px 0;">Please verify your email address to activate your account.</p>
        <p style="margin: 0 0 20px 0;">After verification, you can log in to your Lodonex Student Portal.</p>
      `;
      const text = `Hello ${name},\n\nWelcome to Lodonex Cooking Academy.\n\nYour account has been successfully created.\nPlease verify your email address to activate your account.\n\nAfter verification, you can log in to your Lodonex Student Portal.\nWebsite: https://lodonex.com/\n\nRegards,\nLodonex Cooking Academy`;
      const html = createEmailHtml({
        title: subject,
        contentHtml,
        callToAction: {
          text: "VERIFY EMAIL",
          url: `${WEBSITE_URL}/portal/login?verify=true`,
        },
      });

      return sendEmailAndLog({ to: email, subject, html, text, emailType: "account_verification", user, pass });
    } else {
      // 2. Admin / Staff / Trainer Registration Email (Awaiting Super Admin Approval)
      const subject = "Lodonex Admin Account Registration";
      const contentHtml = `
        <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
        <p style="margin: 0 0 16px 0;">Your Lodonex administrator account has been registered successfully.</p>
        <p style="margin: 0 0 16px 0;">Your account is currently awaiting approval from the Lodonex Super Administrator.</p>
        <p style="margin: 0 0 16px 0;">You will receive another email once your account is approved.</p>
      `;
      const text = `Hello ${name},\n\nYour Lodonex administrator account has been registered successfully.\n\nYour account is currently awaiting approval from the Lodonex Super Administrator.\n\nYou will receive another email once your account is approved.\n\nRegards,\nLodonex Cooking Academy`;
      const html = createEmailHtml({ title: subject, contentHtml });

      return sendEmailAndLog({ to: email, subject, html, text, emailType: "admin_registration", user, pass });
    }
  }
);

/**
 * 2. Cloud Function: Triggered when user status changes (e.g. pending -> active)
 * Sends Admin Approval Email.
 */
exports.onUserStatusChanged = onDocumentUpdated(
  {
    document: "users/{userId}",
    secrets: [gmailAppPassword, gmailUserSecret],
  },
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    // Check if status changed from pending to active/approved for administrative accounts
    if (before.status === "pending" && (after.status === "active" || after.status === "approved")) {
      const email = after.email;
      const name = after.name || "Administrator";
      const user = gmailUserSecret.value() || GMAIL_DEFAULT_USER;
      const pass = gmailAppPassword.value();

      const subject = "Your Lodonex Admin Account Has Been Approved";
      const contentHtml = `
        <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
        <p style="margin: 0 0 16px 0;">Your Lodonex administrator account has been approved.</p>
        <p style="margin: 0 0 20px 0;">You can now log in to the Lodonex Admin Portal.</p>
      `;
      const text = `Hello ${name},\n\nYour Lodonex administrator account has been approved.\n\nYou can now log in to the Lodonex Admin Portal.\nWebsite: https://lodonex.com/\n\nRegards,\nLodonex Cooking Academy`;
      const html = createEmailHtml({
        title: subject,
        contentHtml,
        callToAction: {
          text: "ADMIN LOGIN",
          url: `${WEBSITE_URL}/team/login`,
        },
      });

      return sendEmailAndLog({ to: email, subject, html, text, emailType: "admin_approval", user, pass });
    }
  }
);

/**
 * 3. Callable Cloud Function: sendLodonexEmail
 * Requires authentication. Restricts arbitrary email sending.
 */
exports.sendLodonexEmail = onCall(
  {
    secrets: [gmailAppPassword, gmailUserSecret],
  },
  async (request) => {
    // Security check: Must be signed in
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated to invoke email service.");
    }

    const { to, subject, html, text, emailType } = request.data;
    if (!to || !subject || (!html && !text)) {
      throw new HttpsError("invalid-argument", "Missing required email parameters (to, subject, content).");
    }

    const user = gmailUserSecret.value() || GMAIL_DEFAULT_USER;
    const pass = gmailAppPassword.value();

    return sendEmailAndLog({ to, subject, html, text, emailType, user, pass });
  }
);
