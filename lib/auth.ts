import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { sendEmail } from '@/utils/email';
import { db } from './db';
import { getBaseUrl } from './get-base-url';

const baseUrl = getBaseUrl();

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),

  rateLimit: {
    window: 10,
    max: 100,
  },

  session: {
    expiresIn: 60 * 60,
    updateAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    // Sends the email with the reset link
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendResetPassword: async (user: any, url: string) => {
      const resetUrl = (() => {
        const urlObj = new URL(url);
        const segments = urlObj.pathname.split('/');
        const token = segments.pop(); // Extract token from path
        const callbackURL = urlObj.searchParams.get('callbackURL') || '/';
        return `${baseUrl}/auth/reset-password?token=${token}&callbackURL=${encodeURIComponent(callbackURL)}`;
      })();

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: auto;">
    <h2>Password Reset Requested</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. If this was you, please click the button below:</p>

    <!-- Table-based button -->
    <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px 0;">
      <tr>
        <td align="center" bgcolor="#1a73e8" style="border-radius: 4px;">
          <table cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding: 12px 24px;">
                <a href="${resetUrl}" target="_blank" style="
                  color: #ffffff;
                  font-size: 16px;
                  font-weight: bold;
                  text-decoration: none;
                  display: inline-block;
                  font-family: Arial, sans-serif;
                ">
                  Reset Password
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p>If you did not request a password reset, you can safely ignore this email.</p>
    <p>Thanks,<br/>Your App Team</p>
  </div>
</body>
</html>
`;

      await sendEmail({
        email: user.email,
        subject: 'Reset your password',
        message: `We received a request to reset your password. If this was you, click the link below:\n${resetUrl}`,
        html,
      });
    },

    // Required by Better Auth to generate and handle reset tokens
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendResetPasswordToken: async (user: any, token: string, callbackURL: string) => {
      const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&callbackURL=${encodeURIComponent(callbackURL)}`;

      await sendEmail({
        email: user.email,
        subject: 'Reset your password',
        message: `Click the link to reset your password: ${resetUrl}`,
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      });
    },
  },

  autoSignIn: false,

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 6000,
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmail({
          email,
          subject: 'Your Code Verification',
          message: `Please use this code to complete your verification.\n ${otp}`,
        });
      },
    }),
  ],

  trustedOrigins: [
    baseUrl,
    `${baseUrl}/api/auth`,
    `${baseUrl}/api/auth/login`,
    `${baseUrl}/api/auth/register`,
    `${baseUrl}/api/auth/reset-password`,
    `${baseUrl}/api/auth/otp-email-verification`,
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
  ],

  cors: {
    credentials: true,
    allowedHeaders: ['content-type', 'authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    origin: (requestOrigin: any, callback: (arg0: null, arg1: boolean) => void) => {
      callback(null, true);
    },
  },
});
