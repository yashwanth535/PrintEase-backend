// utils/emailTemplates.js

const getPasswordChangedEmailHTML = (type,url) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed Successfully</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px;">
    
    <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
      
      <!-- Header with Gradient -->
      <tr>
        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 100px; height: 100px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
            Password Changed!
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
            Your ${type} password has been successfully updated
          </p>
        </td>
      </tr>
      
      <!-- Main Content -->
      <tr>
        <td style="padding: 50px 40px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="margin: 0 0 15px; color: #1e293b; font-size: 24px; font-weight: 600;">
              You're All Set! 🎉
            </h2>
            <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.6;">
              Your PrintEase ${type} password has been changed successfully. You can now sign in with your new password.
            </p>
          </div>
          
          <!-- Info Box -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <p style="margin: 0 0 15px; color: #1e293b; font-size: 15px; font-weight: 600;">
              🔐 Security Tips:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
              <li>Never share your password with anyone</li>
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication if available</li>
              <li>If you didn't make this change, contact support immediately</li>
            </ul>
          </div>
          
          <!-- Login Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${url}" 
              style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
              Sign In to ${type} Portal
            </a>
          </div>
          
          <!-- Login URL -->
          <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
              Or copy this link:
            </p>
            <a href="${url}" 
              style="color: #667eea; text-decoration: none; font-size: 14px; word-break: break-all;">
              ${url}
            </a>
          </div>
          
          <!-- Timestamp -->
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 10px;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              Password changed on ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="background: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 5px; color: #1e293b; font-size: 20px; font-weight: 700;">
              PrintEase
            </h3>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">
              Revolutionizing Print Services
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
              Need help? Contact our support team<br>
              <a href="mailto:verify.printease@gmail.com" style="color: #667eea; text-decoration: none;">
                support@printease.com
              </a>
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 11px;">
              © ${new Date().getFullYear()} PrintEase. All rights reserved.
            </p>
            <p style="margin: 10px 0 0; color: #cbd5e1; font-size: 11px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </td>
      </tr>
      
    </table>
    
  </body>
  </html>
  `;
};


const getNewLoginEmailHTML = (type,url) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Login Detected</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px;">
    
    <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
      
      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 100px; height: 100px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 14L21 3"></path>
              <path d="M21 3l-6 18a1 1 0 0 1-1.94.35L10 14 3.65 10.94a1 1 0 0 1 .35-1.94L21 3z"></path>
            </svg>
          </div>
          <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
            New Login Detected!
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
            A new ${type.toLowerCase()} login was detected on your PrintEase account
          </p>
        </td>
      </tr>
      
      <!-- Main Content -->
      <tr>
        <td style="padding: 50px 40px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="margin: 0 0 15px; color: #1e293b; font-size: 24px; font-weight: 600;">
              Was this you? 👀
            </h2>
            <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.6;">
              A new sign-in as <strong>${type}</strong> was detected on your PrintEase account.  
              Please verify if this was initiated by you.
            </p>
          </div>

          <!-- Info Box -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <p style="margin: 0 0 15px; color: #1e293b; font-size: 15px; font-weight: 600;">
              🔍 Login Summary:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
              <li><strong>Role:</strong> ${type}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</li>
            </ul>
          </div>

          <!-- Security Suggestion -->
          <div style="text-align: center; margin-top: 40px;">
            <p style="margin: 0 0 15px; color: #64748b; font-size: 15px; line-height: 1.6;">
              If this was you, no further action is needed.  
              If not, we recommend changing your password immediately.
            </p>
            <a href="${url}" 
              style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4); transition: all 0.3s ease;">
              Secure My Account
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 5px; color: #1e293b; font-size: 20px; font-weight: 700;">
              PrintEase
            </h3>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">
              Revolutionizing Print Services
            </p>
          </div>
          <div style="margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
              Need help? Contact our support team<br>
              <a href="mailto:verify.printease@gmail.com" style="color: #667eea; text-decoration: none;">
                support@printease.com
              </a>
            </p>
          </div>
          <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 11px;">
              © ${new Date().getFullYear()} PrintEase. All rights reserved.
            </p>
            <p style="margin: 10px 0 0; color: #cbd5e1; font-size: 11px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </td>
      </tr>

    </table>
  </body>
  </html>
  `;
};

const getSignupSuccessEmailHTML = (type, url) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to PrintEase</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px;">

    <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">

      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 100px; height: 100px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
            Welcome to PrintEase!
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
            Thank you for signing up as a ${type.toLowerCase()} on PrintEase 🎉
          </p>
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td style="padding: 50px 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px; color: #1e293b; font-size: 24px; font-weight: 600;">
              We're glad to have you on board!
            </h2>
            <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.6;">
              Your ${type.toLowerCase()} account has been successfully created.  
              You can now access all the features and tools designed for ${type.toLowerCase()}s on PrintEase.
            </p>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${url}" 
              style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
              Go to ${type} Portal
            </a>
          </div>

          <!-- Alternative Link -->
          <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
              Or copy this link:
            </p>
            <a href="${url}" 
              style="color: #667eea; text-decoration: none; font-size: 14px; word-break: break-all;">
              ${url}
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 5px; color: #1e293b; font-size: 20px; font-weight: 700;">
              PrintEase
            </h3>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">
              Revolutionizing Print Services
            </p>
          </div>
          <div style="margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
              Need help? Contact our support team<br>
              <a href="mailto:verify.printease@gmail.com" style="color: #667eea; text-decoration: none;">
                support@printease.com
              </a>
            </p>
          </div>
          <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 11px;">
              © ${new Date().getFullYear()} PrintEase. All rights reserved.
            </p>
            <p style="margin: 10px 0 0; color: #cbd5e1; font-size: 11px;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </td>
      </tr>

    </table>
  </body>
  </html>
  `;
};

const getOrderCompletedEmailHTML = (userEmail, vendorEmail, order) => {
  const completedAt = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const createdAt = new Date(order.createdAt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Completed</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); min-height: 100vh; padding: 40px 20px;">
    
    <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden;">
      
      <!-- Header -->
      <tr>
        <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 50px 40px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 100px; height: 100px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
            Order Completed Successfully 🎉
          </h1>
          <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
            Your PrintEase order has been fulfilled by the vendor
          </p>
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td style="padding: 50px 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px; color: #1e293b; font-size: 22px; font-weight: 600;">
              Hello, ${userEmail}
            </h2>
            <p style="margin: 0; color: #64748b; font-size: 16px; line-height: 1.6;">
              Your order has been successfully printed and is ready for collection.
            </p>
          </div>

          <!-- Order Info -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #16a34a; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <p style="margin: 0 0 15px; color: #1e293b; font-size: 15px; font-weight: 600;">
              📦 Order Summary:
            </p>
            <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
              <li><strong>Order ID:</strong> ${order._id}</li>
              <li><strong>Vendor:</strong> ${vendorEmail}</li>
              <li><strong>Total Price:</strong> ₹${order.totalPrice.toFixed(2)}</li>
              <li><strong>Pages:</strong> ${order.pages}</li>
              <li><strong>Sets:</strong> ${order.sets}</li>
              <li><strong>Paper Size:</strong> ${order.size}</li>
              <li><strong>Binding:</strong> ${order.binding}</li>
              <li><strong>Color:</strong> ${order.color ? 'Color Print' : 'Black & White'}</li>
              <li><strong>Order Created At:</strong> ${createdAt}</li>
              <li><strong>Order Completed At:</strong> ${completedAt}</li>
            </ul>
          </div>

          <!-- Next Steps -->
          <div style="text-align: center; margin-top: 40px;">
            <p style="margin: 0 0 15px; color: #64748b; font-size: 15px; line-height: 1.6;">
              You can now visit the vendor store to collect your prints.  
              We hope you enjoyed using <strong>PrintEase</strong> 💙
            </p>
            <a href="https://printease.com" 
              style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; padding: 14px 38px; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4); transition: all 0.3s ease;">
              Visit PrintEase
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 5px; color: #1e293b; font-size: 20px; font-weight: 700;">
              PrintEase
            </h3>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">
              Revolutionizing Print Services
            </p>
          </div>
          <div style="margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
              Need help? Contact our support team<br>
              <a href="mailto:verify.printease@gmail.com" style="color: #16a34a; text-decoration: none;">
                support@printease.com
              </a>
            </p>
          </div>
          <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 11px;">
              © ${new Date().getFullYear()} PrintEase. All rights reserved.
            </p>
            <p style="margin: 10px 0 0; color: #cbd5e1; font-size: 11px;">
              This is an automated message, please do not reply.
            </p>
          </div>
        </td>
      </tr>

    </table>
  </body>
  </html>
  `;
};

const getPaymentSuccessTemplate = (totalPrice, orderId) => {
  const numericPrice = Number(totalPrice) || 0;
  const orderPrice = numericPrice;
  const platformFee = numericPrice * 0.05;
  const finalAmount = orderPrice + platformFee;
  const transactionId = orderId || "N/A";

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; color: white; padding: 16px; text-align: center;">
          <h2>💳 Payment Successful!</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear User,</p>
          <p>Your payment has been successfully processed. Here are your payment details:</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">🧾 <strong>Order Price</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${orderPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">💼 <strong>Platform Fee (5%)</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${platformFee.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">💰 <strong>Total Amount</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${finalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Transaction ID</strong></td>
              <td style="padding: 8px;">${transactionId}</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">Thank you for choosing <strong>PrintEase</strong>! We appreciate your trust.</p>
          <p style="color: #555;">If you have any issues, please contact support.</p>
        </div>
        <div style="background: #f3f4f6; text-align: center; padding: 10px;">
          <p style="margin: 0; font-size: 12px; color: #888;">© ${new Date().getFullYear()} PrintEase. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
};




export{
  getPasswordChangedEmailHTML,
  getNewLoginEmailHTML,
  getSignupSuccessEmailHTML,
  getOrderCompletedEmailHTML,
  getPaymentSuccessTemplate
}
