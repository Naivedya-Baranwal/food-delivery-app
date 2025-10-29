import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS, // App password from Google Account
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates for better delivery
  },
  pool: true, // Use pooled connections
  maxConnections: 5, // Increased for better throughput
  maxMessages: 20, // Increased for better reliability
  rateDelta: 1000, // 1 second delay between messages
  rateLimit: 5, // 5 emails per rateDelta
  connectionTimeout: 15000, // 15 seconds
  socketTimeout: 20000, // 20 seconds
  greetingTimeout: 10000, // 10 seconds
  logger: true, // Enable logging
  debug: process.env.NODE_ENV !== 'production' // Debug in development
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ SMTP connection error:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

export const sendOtpMail = async (to, otp) => {
  // Validate input
  if (!to || !otp) {
    throw new Error('Email address and OTP are required');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    throw new Error('Invalid email address format');
  }

  console.log(`📧 Initiating email send to: ${to}`);

  try {
    // Skip SMTP verification in retry logic - it's already done at startup
    console.log('📧 Proceeding with email send...');

    const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #ffffff;">
      <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Food Delivery OTP</h2>
      <div style="background-color: #f8f8f8; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0; font-size: 32px; letter-spacing: 5px; color: #2c3e50;">${otp}</h3>
      </div>
      <p style="color: #666; text-align: center; font-size: 16px;">Your OTP for food delivery verification is shown above.</p>
      <p style="color: #e74c3c; text-align: center; font-weight: bold;">This code will expire in <strong>5 minutes</strong>.</p>
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
        <p style="margin: 5px 0;">If you didn't request this code, please ignore this email.</p>
        <p style="margin: 5px 0; color: #e74c3c;">Do not share this OTP with anyone.</p>
      </div>
    </div>
    `;

    // Set retry options with exponential backoff
    const maxRetries = 3; // Increased retries for better delivery
    const baseDelay = 1500; // 1.5 seconds base delay
    let attempt = 1;
    let lastError = null;

    while (attempt <= maxRetries) {
      try {
        console.log(`📧 Attempt ${attempt} of ${maxRetries} to send email`);

        // Use Promise.race to implement timeout
        const info = await Promise.race([
          transporter.sendMail({
            from: {
              name: "Food Delivery Service",
              address: process.env.EMAIL
            },
            to,
            subject: "Your Food Delivery OTP",
            html: emailTemplate,
            text: `Your Food Delivery OTP is: ${otp}. This code will expire in 5 minutes. Do not share this OTP with anyone.`, // Plain text fallback
            headers: {
              'priority': 'high',
              'x-delivery-attempt': attempt.toString(),
              'X-Priority': '1',
              'Importance': 'high'
            },
            priority: 'high',
            disableFileAccess: true,
            disableUrlAccess: true
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Email send timeout')), 20000) // 20 second timeout
          )
        ]);

        console.log(`✅ Email sent successfully on attempt ${attempt}`);
        console.log('📧 Message ID:', info.messageId);

        if (process.env.NODE_ENV !== 'production') {
          console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return {
          success: true,
          messageId: info.messageId,
          attempt,
          previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : undefined
        };
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        lastError = error;

        if (attempt < maxRetries) {
          const delay = baseDelay * attempt;
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        attempt++;
      }
    }

    // If we get here, all retries failed
    console.error('❌ All email send attempts failed');
    console.error('Last error details:', {
      code: lastError.code,
      command: lastError.command,
      response: lastError.response,
      responseCode: lastError.responseCode
    });

    // Determine error type
    const errorType = lastError.code || 'unknown';
    const isTransientError = [
      'ECONNECTION', 'ETIMEOUT', 'EBUSY',
      'ETIMEDOUT', 'ENOTFOUND', 'EREFUSED'
    ].some(code => errorType.includes(code));

    throw new Error(
      isTransientError
        ? 'Temporary email delivery issue. Please try again.'
        : 'Failed to send email after multiple attempts.'
    );
  } catch (error) {
    console.error('❌ Fatal email error:', error);
    throw error;
  }
};
