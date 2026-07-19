import nodemailer from "nodemailer";


export const sendEmail = async ({ to, subject, html }) => {
  // integrate nodemailer / sendgrid in real project
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.FROM,
    to,
    subject,
    html,
  };
  const info = await transporter.sendMail(mailOptions);

  console.log(`Email sent: ${info.messageId}`);
  return info;
};

export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  console.log(resetURL);
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; background: #0f0e17; color: #fff; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; padding: 40px;">
        <h1 style="color: #a855f7; margin-bottom: 8px;">MathMate AI</h1>
        <h2 style="color: #fff;">Password Reset Request</h2>
        <p style="color: #aaa;">Hi ${userName},</p>
        <p style="color: #aaa;">You requested to reset your password. Click the button below to continue:</p>
        <a href="${resetURL}" 
           style="display: inline-block; background: linear-gradient(135deg, #ec4899, #a855f7); 
                  color: white; padding: 14px 28px; border-radius: 8px; 
                  text-decoration: none; font-weight: bold; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 12px;">This link expires in 15 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
  return sendEmail({to: email, subject: 'MathMate - Reset Your Password', html});
};


export const sendVerificationEmail = async (
  email,
  verificationCode,
  username
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px">

      <div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:10px">

        <h2>Welcome to MathMate AI</h2>

        <p>Hello <strong>${username}</strong>,</p>

        <p>Thank you for registering.</p>

        <p>Please use the verification code below:</p>

        <div
          style="
            font-size:36px;
            font-weight:bold;
            letter-spacing:8px;
            text-align:center;
            margin:30px 0;
            color:#6d28d9;
          "
        >
          ${verificationCode}
        </div>

        <p>
          This code expires in
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't create this account, you can safely ignore this email.
        </p>

      </div>

    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "MathMate AI - Email Verification Code",
    html,
  });
};