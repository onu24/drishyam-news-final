import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587');
const secure = process.env.SMTP_SECURE === 'true'; // true for port 465, false for other ports
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS?.replace(/\s/g, '');

const transportConfig = host
  ? {
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false, // Prevents certificate verification issues on custom domains/environments
      },
    }
  : {
      service: 'gmail',
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    };

const transporter = nodemailer.createTransport(transportConfig);

export default transporter;

export async function sendMail({ from, replyTo, to, subject, text, html, attachments }: { 
  from?: string,
  replyTo?: string,
  to: string, 
  subject: string, 
  text?: string, 
  html?: string, 
  attachments?: any[] 
}) {
  const mailOptions = {
    from: from || `"Drishyam News" <${process.env.SMTP_USER}>`,
    replyTo: replyTo || process.env.CAREERS_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
    attachments,
  };

  return transporter.sendMail(mailOptions);
}
