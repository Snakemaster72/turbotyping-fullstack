import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, token, type = 'custom' }) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Email template for verification
  const verificationTemplate = (token) => `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #fe8019; text-align: center;">Welcome to Turbo Typing!</h1>
      <p style="color: #3c3836; font-size: 16px; line-height: 1.5;">
        Thank you for registering. Please verify your email address to complete your registration.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/verify-email/${token}" 
           style="background-color: #fe8019; color: #282828; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; font-weight: bold;">
          Verify Email
        </a>
      </div>
      <p style="color: #665c54; font-size: 14px; text-align: center;">
        If you didn't create an account, you can safely ignore this email.
      </p>
      <p style="color: #665c54; font-size: 14px; text-align: center;">
        This verification link will expire in 1 hour.
      </p>
    </div>
  `;

  // Configure email options
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html: type === 'verification' ? verificationTemplate(token) : html,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
