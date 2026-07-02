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

  await transporter.sendMail({
    from: process.env.FROM,
    to,
    subject,
    html,
  });
};