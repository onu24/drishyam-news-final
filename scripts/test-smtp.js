const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.SMTP_PORT || '587');
const secure = process.env.SMTP_SECURE === 'true'; // true for port 465, false for other ports
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s/g, '') : '';

console.log('Testing Robust SMTP parameters:');
console.log('Host:', host);
console.log('Port:', port);
console.log('Secure:', secure);
console.log('User:', user);
console.log('Pass:', pass ? '*** (length: ' + pass.length + ')' : 'undefined');

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass,
  },
  tls: {
    rejectUnauthorized: false, // Prevents TLS certificate verification issues
  },
});

async function run() {
  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('Connection verified successfully!');
    
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Drishyam Test" <${user}>`,
      to: user,
      subject: 'Drishyam SMTP Test (Robust Custom Config)',
      text: 'If you are receiving this, your SMTP custom host configuration with TLS bypass is working perfectly!',
    });
    console.log('Email sent successfully!', info.messageId);
  } catch (error) {
    console.error('SMTP Error:', error);
  }
}

run();
