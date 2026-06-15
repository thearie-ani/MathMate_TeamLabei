export const sendEmail = async ({ to, subject, text }) => {
  // integrate nodemailer / sendgrid in real project
  console.log(`Email to ${to}: ${subject} -> ${text}`);
};