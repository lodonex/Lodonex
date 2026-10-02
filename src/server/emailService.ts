import nodemailer from "nodemailer";

export interface EmailLogEntry {
  emailId: string;
  recipient: string;
  emailType: string;
  subject: string;
  status: "sent" | "simulated" | "failed";
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
}

// In-memory log store with fallback
export const emailLogsStore: EmailLogEntry[] = [];

// Rate-limiting / 60-second cooldown tracker: recipient -> lastSentTimestamp
const resendCooldownTracker = new Map<string, number>();

// Configuration from secure environment variables (NEVER expose to frontend)
const GMAIL_USER = process.env.GMAIL_USER || "lodonexcookingacademy@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";
const APP_URL = process.env.APP_URL || "https://lodonex.com";

// Create Nodemailer Transporter
function getTransporter() {
  if (!GMAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Port 465 requires secure: true
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

// Base HTML layout with responsive Lodonex branding
function createBrandedEmailTemplate({
  title,
  preheader,
  contentHtml,
  callToAction,
}: {
  title: string;
  preheader: string;
  contentHtml: string;
  callToAction?: { text: string; url: string };
}): string {
  const ctaButton = callToAction
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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { color: #C8102E; text-decoration: underline; }
    @media only screen and (max-width: 600px) {
      .main-table { width: 100% !important; border-radius: 0 !important; }
      .content-padding { padding: 24px 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #F7F5F0;">
  <!-- Preheader preview text -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #F7F5F0; mso-hide: all;">
    ${preheader}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 10px 15px;">
        <!-- Container Card -->
        <table class="main-table" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #E5E0D8; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #111111; padding: 26px 20px; border-bottom: 3px solid #C8102E;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, serif; font-size: 26px; font-weight: bold; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; display: block;">
                      LODONEX
                    </span>
                    <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: bold; color: #C8102E; letter-spacing: 3px; text-transform: uppercase; display: block; margin-top: 4px;">
                      Lodonex Cooking Academy
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="content-padding" style="padding: 36px 36px 28px 36px; color: #222222; font-size: 14px; line-height: 1.65;">
              ${contentHtml}
              ${ctaButton}
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #EEEEEE; font-size: 13px; color: #555555;">
                <p style="margin: 0 0 4px 0;">Regards,</p>
                <p style="margin: 0; font-weight: bold; color: #111111;">Lodonex Cooking Academy</p>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #888888;">Accredited Culinary Arts & Professional Gastronomy</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FDFCF9; padding: 22px 30px; border-top: 1px solid #EAE6DF; text-align: center; font-size: 11px; color: #777777; line-height: 1.5;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #333333;">
                Lodonex Cooking Academy • Dhaka, Bangladesh
              </p>
              <p style="margin: 0 0 8px 0;">
                Website: <a href="https://lodonex.com/" style="color: #C8102E; text-decoration: none; font-weight: bold;">https://lodonex.com/</a>
                &nbsp;|&nbsp;
                Email: <a href="mailto:${GMAIL_USER}" style="color: #C8102E; text-decoration: none;">${GMAIL_USER}</a>
              </p>
              <p style="margin: 0; font-size: 10px; color: #999999;">
                This transactional email was sent to you regarding your official account or enrollment at Lodonex Cooking Academy.
              </p>
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
 * Reusable Core Email Sender
 */
export async function sendLodonexEmail({
  to,
  subject,
  html,
  text,
  emailType = "general",
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  emailType?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string; simulated?: boolean }> {
  const emailId = `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanRecipient = to.trim().toLowerCase();

  const logEntry: EmailLogEntry = {
    emailId,
    recipient: cleanRecipient,
    emailType,
    subject,
    status: "sent",
    createdAt: new Date().toISOString(),
  };

  try {
    const transporter = getTransporter();

    if (!transporter) {
      // Secret not yet configured: Log in simulated delivery mode so account flows NEVER fail
      console.log(`[LODONEX EMAIL SIMULATOR] Recipient: ${cleanRecipient} | Subject: "${subject}" | Type: ${emailType}`);
      logEntry.status = "simulated";
      logEntry.sentAt = new Date().toISOString();
      emailLogsStore.unshift(logEntry);

      return {
        success: true,
        messageId: `simulated-${emailId}`,
        simulated: true,
      };
    }

    // Send using real Nodemailer Gmail SMTP
    const info = await transporter.sendMail({
      from: `"Lodonex Cooking Academy" <${GMAIL_USER}>`,
      to: cleanRecipient,
      subject,
      text,
      html,
    });

    logEntry.status = "sent";
    logEntry.sentAt = new Date().toISOString();
    emailLogsStore.unshift(logEntry);

    console.log(`[LODONEX EMAIL SENT] Message ID: ${info.messageId} to: ${cleanRecipient}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error(`[LODONEX EMAIL ERROR] Failed to send email to ${cleanRecipient}:`, err?.message || err);

    logEntry.status = "failed";
    logEntry.errorMessage = err?.message || String(err);
    emailLogsStore.unshift(logEntry);

    // Graceful error return: do NOT crash the caller
    return {
      success: false,
      error: err?.message || "Failed to send email via Gmail SMTP.",
    };
  }
}

/**
 * Check and enforce 60-second cooldown for resend verification
 */
export function checkResendCooldown(recipient: string): { allowed: boolean; remainingSeconds: number } {
  const clean = recipient.trim().toLowerCase();
  const lastTime = resendCooldownTracker.get(clean);
  const now = Date.now();

  if (lastTime) {
    const elapsedSeconds = Math.floor((now - lastTime) / 1000);
    const cooldownPeriod = 60; // 60 seconds
    if (elapsedSeconds < cooldownPeriod) {
      return {
        allowed: false,
        remainingSeconds: cooldownPeriod - elapsedSeconds,
      };
    }
  }

  resendCooldownTracker.set(clean, now);
  return { allowed: true, remainingSeconds: 0 };
}

// ==========================================
// PRE-BUILT BRANDED EMAIL TEMPLATES
// ==========================================

/**
 * 1. Student Registration & Welcome Verification Email
 */
export async function sendStudentWelcomeEmail({
  email,
  name,
  verificationUrl,
}: {
  email: string;
  name: string;
  verificationUrl?: string;
}) {
  const verifyLink = verificationUrl || `${APP_URL}/portal/login?verify=true`;
  const subject = "Welcome to Lodonex Cooking Academy";

  const contentHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
    <p style="margin: 0 0 16px 0;">Welcome to <strong>Lodonex Cooking Academy</strong>.</p>
    <p style="margin: 0 0 16px 0;">Your apprentice account has been successfully created.</p>
    <p style="margin: 0 0 20px 0;">Please verify your email address to activate your account and unlock your student portal:</p>
  `;

  const text = `
Hello ${name},

Welcome to Lodonex Cooking Academy.

Your account has been successfully created.

Please verify your email address to activate your account:
${verifyLink}

After verification, you can log in to your Lodonex Student Portal:
${APP_URL}/portal/login

Website: https://lodonex.com/

Regards,
Lodonex Cooking Academy
  `.trim();

  const html = createBrandedEmailTemplate({
    title: subject,
    preheader: `Welcome to Lodonex Cooking Academy, ${name}. Please verify your email address.`,
    contentHtml,
    callToAction: {
      text: "VERIFY EMAIL",
      url: verifyLink,
    },
  });

  return sendLodonexEmail({
    to: email,
    subject,
    html,
    text,
    emailType: "account_verification",
  });
}

/**
 * 2. Admin Registration Email (Pending Super Admin Review)
 */
export async function sendAdminRegistrationEmail({
  email,
  name,
  role = "admin",
}: {
  email: string;
  name: string;
  role?: string;
}) {
  const subject = "Lodonex Admin Account Registration";

  const contentHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
    <p style="margin: 0 0 16px 0;">Your Lodonex administrator account (<strong>${role.toUpperCase()}</strong>) has been registered successfully.</p>
    <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; padding: 14px 16px; margin: 20px 0; font-size: 13px; color: #92400E;">
      <strong>Review Status: PENDING APPROVAL</strong><br/>
      Your account is currently awaiting approval from the Lodonex Super Administrator.
    </div>
    <p style="margin: 0 0 16px 0;">You will receive another confirmation email once your account has been reviewed and activated.</p>
  `;

  const text = `
Hello ${name},

Your Lodonex administrator account has been registered successfully.

Your account is currently awaiting approval from the Lodonex Super Administrator.

You will receive another email once your account is approved.

Website: https://lodonex.com/

Regards,
Lodonex Cooking Academy
  `.trim();

  const html = createBrandedEmailTemplate({
    title: subject,
    preheader: `Hello ${name}, your administrator account registration is awaiting Super Admin approval.`,
    contentHtml,
  });

  return sendLodonexEmail({
    to: email,
    subject,
    html,
    text,
    emailType: "admin_registration",
  });
}

/**
 * 3. Admin Approval Email
 */
export async function sendAdminApprovalEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const loginUrl = `${APP_URL}/team/login`;
  const subject = "Your Lodonex Admin Account Has Been Approved";

  const contentHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
    <p style="margin: 0 0 16px 0;">Your Lodonex administrator account has been <strong>approved</strong> by the Super Administrator.</p>
    <p style="margin: 0 0 20px 0;">You can now log in to the Lodonex Team / Administration Portal using your registered email and password.</p>
  `;

  const text = `
Hello ${name},

Your Lodonex administrator account has been approved.

You can now log in to the Lodonex Admin Portal:
${loginUrl}

Website: https://lodonex.com/

Regards,
Lodonex Cooking Academy
  `.trim();

  const html = createBrandedEmailTemplate({
    title: subject,
    preheader: `Hello ${name}, your Lodonex administrator account has been approved.`,
    contentHtml,
    callToAction: {
      text: "ADMIN LOGIN",
      url: loginUrl,
    },
  });

  return sendLodonexEmail({
    to: email,
    subject,
    html,
    text,
    emailType: "admin_approval",
  });
}

/**
 * 4. Course Enrollment Confirmation Email
 */
export async function sendEnrollmentApprovalEmail({
  email,
  name,
  courseName,
  batchName,
}: {
  email: string;
  name: string;
  courseName: string;
  batchName?: string;
}) {
  const portalUrl = `${APP_URL}/student/courses`;
  const subject = "Your Lodonex Course Enrollment Has Been Approved";

  const contentHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
    <p style="font-size: 15px; font-weight: bold; color: #166534; margin: 0 0 14px 0;">Congratulations! 🎉</p>
    <p style="margin: 0 0 14px 0;">Your enrollment in the following culinary program has been officially approved:</p>
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; margin: 18px 0; border-radius: 2px;">
      <p style="margin: 0; font-size: 15px; font-weight: bold; color: #0F172A;">${courseName}</p>
      ${batchName ? `<p style="margin: 6px 0 0 0; font-size: 12px; color: #64748B;">Assigned Cohort: <strong>${batchName}</strong></p>` : ""}
    </div>
    <p style="margin: 0 0 20px 0;">You can now access your full curriculum, interactive cooking lessons, live lab schedules, and assignments through your Lodonex Student Portal.</p>
  `;

  const text = `
Hello ${name},

Congratulations!

Your enrollment in:
${courseName}
has been approved.

You can now access your course through your Lodonex Student Portal:
${portalUrl}

Regards,
Lodonex Cooking Academy
  `.trim();

  const html = createBrandedEmailTemplate({
    title: subject,
    preheader: `Congratulations ${name}! Your enrollment in ${courseName} has been approved.`,
    contentHtml,
    callToAction: {
      text: "LOGIN TO STUDENT PORTAL",
      url: portalUrl,
    },
  });

  return sendLodonexEmail({
    to: email,
    subject,
    html,
    text,
    emailType: "enrollment_confirmation",
  });
}

/**
 * 5. Payment Confirmation Email
 */
export async function sendPaymentConfirmationEmail({
  email,
  name,
  courseName,
  amountPaid,
  paymentDate,
  transactionId,
}: {
  email: string;
  name: string;
  courseName: string;
  amountPaid: number | string;
  paymentDate: string;
  transactionId: string;
}) {
  const subject = "Lodonex Payment Confirmation";

  const formattedAmount = typeof amountPaid === "number" ? `BDT ${amountPaid.toLocaleString()}` : amountPaid;

  const contentHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
    <p style="margin: 0 0 16px 0;">This email confirms that your tuition payment has been verified by the Lodonex Finance & Registrar Office.</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0; background-color: #FDFCF9; border: 1px solid #EAE6DF; font-size: 13px;">
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; color: #666666;">Student Name:</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; font-weight: bold; color: #111111;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; color: #666666;">Enrolled Course:</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; font-weight: bold; color: #111111;">${courseName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; color: #666666;">Amount Verified:</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; font-weight: bold; color: #166534;">${formattedAmount}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; color: #666666;">Payment Date:</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #EAE6DF; font-weight: bold; color: #111111;">${paymentDate}</td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; color: #666666;">Reference / TrxID:</td>
        <td style="padding: 10px 14px; font-family: monospace; font-weight: bold; color: #111111;">${transactionId}</td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 12px; color: #666666;">Please keep this receipt for your personal academic records.</p>
  `;

  const text = `
Hello ${name},

Lodonex Payment Confirmation

Student Name: ${name}
Course Name: ${courseName}
Amount Paid: ${formattedAmount}
Payment Date: ${paymentDate}
Transaction / Reference Number: ${transactionId}

Regards,
Lodonex Cooking Academy
  `.trim();

  const html = createBrandedEmailTemplate({
    title: subject,
    preheader: `Payment confirmation receipt for ${name} - ${formattedAmount}`,
    contentHtml,
  });

  return sendLodonexEmail({
    to: email,
    subject,
    html,
    text,
    emailType: "payment_confirmation",
  });
}

/**
 * 6. Certificate Ready Email
 */
export async function sendCertificateReadyEmail({
  email,
  name,
  courseName,
  certificateNumber,
}: {
  email: string;
  name: string;
  courseName: string;
  certificateNumber: string;
}) {
  const certUrl = `${APP_URL}/verify-cert?certNumber=${encodeURIComponent(certificateNumber)}`;
  const subject = "Your Lodonex Certificate Is Ready";

  const contentHtml = `
    <p style="font-size: 16px; margin: 0 0 16px 0;">Hello <strong>${name}</strong>,</p>
    <p style="font-size: 15px; font-weight: bold; color: #166534; margin: 0 0 14px 0;">Congratulations on completing your culinary training! 🎓</p>
    <p style="margin: 0 0 16px 0;">Your accredited digital certificate of completion has been officially signed and issued by the academic board:</p>
    
    <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; padding: 18px; margin: 20px 0; text-align: center;">
      <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #92400E; display: block; letter-spacing: 1px;">
        Accredited Culinary Award
      </span>
      <h3 style="margin: 6px 0; font-size: 18px; color: #78350F;">${courseName}</h3>
      <p style="margin: 6px 0 0 0; font-family: monospace; font-size: 13px; font-weight: bold; color: #92400E;">
        Certificate No: ${certificateNumber}
      </p>
    </div>

    <p style="margin: 0 0 20px 0;">You can verify, view, and download your accredited diploma online anytime via the public verification portal:</p>
  `;

  const text = `
Hello ${name},

Your Lodonex Certificate Is Ready!

Student Name: ${name}
Course Name: ${courseName}
Certificate Number: ${certificateNumber}

View and verify your certificate:
${certUrl}

Regards,
Lodonex Cooking Academy
  `.trim();

  const html = createBrandedEmailTemplate({
    title: subject,
    preheader: `Congratulations ${name}! Your certificate for ${courseName} is ready.`,
    contentHtml,
    callToAction: {
      text: "VIEW CERTIFICATE",
      url: certUrl,
    },
  });

  return sendLodonexEmail({
    to: email,
    subject,
    html,
    text,
    emailType: "certificate_notification",
  });
}
