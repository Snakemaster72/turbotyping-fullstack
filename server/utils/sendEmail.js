import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

const sendEmail = async ({ to, subject, html, token, type = 'custom' }) => {
  const { data, error } = await resend.emails.send({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html: type === 'verification' ? verificationTemplate(token) : html,
  });

  if (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }

  console.log('Email sent:', data.id);
  return data;
};

export default sendEmail;
