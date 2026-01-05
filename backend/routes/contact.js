const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
  });
};

// @route   POST /api/contact/send
// @desc    Send contact form message to admin
// @access  Public
router.post('/send', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('message').trim().isLength({ min: 20 }).withMessage('Message must be at least 20 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, category, message } = req.body;

    // Email content for admin
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #a855f7 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #6b7280; margin-top: 5px; }
          .message-box { background: white; padding: 15px; border-left: 4px solid #f97316; margin-top: 15px; }
          .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Shiv Mobile Hub</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${phone}</div>
            </div>
            <div class="field">
              <div class="label">Category:</div>
              <div class="value">${category}</div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            <div class="message-box">
              <div class="label">Message:</div>
              <div class="value">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0;">This is an automated message from your website contact form.</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Please respond to the customer at: ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email content for customer (auto-reply)
    const customerEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #a855f7 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">Thank You for Contacting Us!</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Shiv Mobile Hub</p>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to us. We have received your message regarding "<strong>${subject}</strong>".</p>
            <p>Our team will review your inquiry and get back to you within 24-48 hours.</p>
            <p><strong>Your message:</strong></p>
            <p style="background: white; padding: 15px; border-left: 4px solid #f97316;">${message}</p>
            <p>If you have any urgent queries, please feel free to call us directly.</p>
            <p>Best regards,<br>Team Shiv Mobile Hub</p>
          </div>
          <div class="footer">
            <p style="margin: 0;">📞 +91 98765 43210 | ✉️ info@shivmobilehub.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    try {
      const transporter = createTransporter();
      
      // Send to admin
      await transporter.sendMail({
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `[Contact Form] ${category}: ${subject}`,
        html: adminEmailHTML,
        replyTo: email
      });

      // Send auto-reply to customer
      await transporter.sendMail({
        from: `"Shiv Mobile Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting Shiv Mobile Hub',
        html: customerEmailHTML
      });

      res.json({
        success: true,
        message: 'Message sent successfully! We will get back to you soon.'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Still return success if email fails (can log to database instead)
      res.json({
        success: true,
        message: 'Message received! We will get back to you soon.'
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

module.exports = router;
