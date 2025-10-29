import nodemailer from 'nodemailer';

// Simple reusable email utility
// Requires env vars: EMAIL_USER, EMAIL_PASS (App password or SMTP creds)

const transporter = nodemailer.createTransport({
  service: 'gmail', // change as needed
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ Ignore self-signed certs (safe for dev)
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) throw new Error('Email "to" address missing');
  try {
    const info = await transporter.sendMail({
      from: `PrintEase <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
