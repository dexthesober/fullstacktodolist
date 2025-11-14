import nodemailer from 'nodemailer';

export async function sendResetEmail(to: string, token: string) {
  const host = process.env.SMTP_HOST;
  if (!host) throw new Error('SMTP not configured');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Password reset',
    html: `<p>Click to reset: <a href="${link}">${link}</a></p>`
  });
}
