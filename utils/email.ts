/* eslint-disable no-console */
// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';

// dotenv.config();

// interface OptionType {
//   email: string;
//   subject: string;
//   message: string;
//   html?: string;
// }

// const sendEmail = async (options: OptionType) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.GMAIL_USER as string,
//       pass: process.env.GMAIL_PASSWORD as string,
//     },
//   });

//   const mailOption = {
//     from: 'Private Tutorial',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     html: options.html || options.message,
//   };

//   await transporter.sendMail(mailOption);
// };

// export { sendEmail };
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

const sendEmail = async ({
  email, subject, message, html,
}: EmailOptions) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken?.token,
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: `Yusuf <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      text: message,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', result.response);
    return result;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

export { sendEmail };
