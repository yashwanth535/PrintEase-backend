import { Admin } from '../models/User_Collection.js';
import { comparePassword, hashPassword } from '../middleware/bcrypt.js';
import { generateToken, verifyToken } from "../config/jwt.config.js";
import { sendEmail } from '../utils/email.js';

// ---------------------------------------------------------------------------------------------------------------------------------------
// ADMIN SIGN IN
// ---------------------------------------------------------------------------------------------------------------------------------------
const adminSignIn = async (req, res) => {
  console.log("Admin signin request received");
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json({ success: false, message: "Admin account not found" });
    }

    const isMatch = await comparePassword(password, admin.pass);
    
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    // Generate tokens
    const email_token = generateToken(email);
    const type_token = generateToken("admin");
    const user_id = generateToken(admin._id);

    const userData = {
      email: email_token,
      type: type_token,
      user_id: user_id
    };

    res.cookie("userData", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    });

    res.json({ success: true, email: admin.email });
    
  } catch (err) {
    console.error('Error during admin signin:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
// ADMIN LOGOUT
// ---------------------------------------------------------------------------------------------------------------------------------------
const adminLogout = async (req, res) => {
  console.log("Admin logout request received");

  res.clearCookie("userData", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.clearCookie("otp", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.json({ success: true, message: "Admin logged out successfully" });
};

// ---------------------------------------------------------------------------------------------------------------------------------------
// CHECK IF ADMIN EXISTS (for forgot password flow)
// ---------------------------------------------------------------------------------------------------------------------------------------
const adminExists = async (req, res) => {
  console.log("Checking if admin exists");
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("Admin not found");
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    console.log("Admin exists");
    return res.status(400).json({ message: 'Admin found' });

  } catch (err) {
    console.error('Error checking admin existence:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
// GENERATE OTP
// ---------------------------------------------------------------------------------------------------------------------------------------
const generateOTP = async (req, res) => {
  console.log("Generating OTP for admin");
  const { email, text } = req.body;

  try {
    // Verify admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);

    // Store OTP in cookie
    const otp_token = generateToken(otp);
    res.cookie("otp", otp_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP email
    await sendEmail({
      to: email,
      subject: 'PrintEase Admin - Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}\n\n${text}\n\nThis OTP will expire in 10 minutes.\nDo not share this code with anyone.`,
    });

    console.log("OTP sent successfully");
    return res.status(200).json({ message: 'OTP sent successfully to admin email' });

  } catch (err) {
    console.error('Error generating OTP:', err);
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
// VERIFY OTP
// ---------------------------------------------------------------------------------------------------------------------------------------
const verifyOTP = (req, res) => {
  console.log("Verifying admin OTP");
  const { otp } = req.body;

  try {
    const otp_cookie = req.cookies.otp;
    
    if (!otp_cookie) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const otp_json = verifyToken(otp_cookie);
    
    if (!otp_json) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (otp_json.userId === otp) {
      console.log("OTP verified successfully");
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      console.log("Incorrect OTP");
      return res.status(400).json({ message: 'The provided OTP is incorrect. Please try again.' });
    }

  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
// RESET PASSWORD
// ---------------------------------------------------------------------------------------------------------------------------------------
const resetPassword = async (req, res) => {
  console.log("Resetting admin password");
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    const hashedPassword = await hashPassword(password);
    admin.pass = hashedPassword;
    await admin.save();

    const sendPasswordResetSuccessEmail = async (email) => {
          const emailHTML = `
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
                  Your admin password has been successfully updated
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
                    Your PrintEase admin password has been changed successfully. You can now sign in with your new password.
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
                  <a href="https://printease.yashwanth.site/admin" 
                    style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                    Sign In to Admin Portal
                  </a>
                </div>
                
                <!-- Login URL -->
                <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
                    Or copy this link:
                  </p>
                  <a href="https://printease.yashwanth.site/admin" 
                    style="color: #667eea; text-decoration: none; font-size: 14px; word-break: break-all;">
                    https://printease.yashwanth.site/admin
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
                    <a href="mailto:support@printease.com" style="color: #667eea; text-decoration: none;">
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

          await sendEmail({
            to: email,
            subject: '✅ Password Changed Successfully - PrintEase Admin',
            html: emailHTML,
          });
        };

        await sendPasswordResetSuccessEmail(email);


    // Clear OTP cookie after successful password reset
    res.clearCookie("otp", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    console.log("Admin password reset successful");
    res.status(200).json({ message: 'Password reset successful' });

  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------------------------------------------------------------------
export {
  adminSignIn,
  adminLogout,
  adminExists,
  generateOTP,
  verifyOTP,
  resetPassword,
};