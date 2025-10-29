import { Admin } from '../models/User_Collection.js';
import { comparePassword, hashPassword } from '../middleware/bcrypt.js';
import { generateToken, verifyToken } from "../config/jwt.config.js";
import { sendEmail } from '../utils/email.js';
import { getPasswordChangedEmailHTML,getNewLoginEmailHTML,getSignupSuccessEmailHTML } from "../utils/mailTemplates.js";

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

    const template = getNewLoginEmailHTML("Admin","https://printease.yashwanth.site/admin");
    await sendEmail({
      to: email,
      subject: 'new Signin Detected',
      html: template,
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


    const emailHTML = getPasswordChangedEmailHTML("admin","https://printease.yashwanth.site/admin");

    await sendEmail({
        to: email,
        subject: '✅ Password Changed Successfully - PrintEase Admin',
        html: emailHTML,
      });

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