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


export const sendVerificationEmail = async ( email, verificationToken, username) => {

    const verificationURL =
        `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const html = `
        <h2>Hello ${username}</h2>

        <p>Thank you for registering.</p>

        <p>Please verify your email by clicking below.</p>

        <a href="${verificationURL}">
            Verify Email
        </a>

        <p>This link expires in 24 hours.</p>
    `;

    return sendEmail({
        to: email,
        subject: "Verify your email",
        html
    });

};