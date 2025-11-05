import { Vendor, User } from '../models/User_Collection.js';
import { comparePassword, hashPassword } from '../middleware/bcrypt.js';
import { generateToken, verifyToken } from "../config/jwt.config.js";
import { sendEmail } from '../utils/email.js';
import { 
  getPasswordChangedEmailHTML,
  getNewLoginEmailHTML,
  getSignupSuccessEmailHTML 
} from "../utils/mailTemplates.js";

// ---------------------------------------------------------------------------------------------------------------------------------------

const setAuthCookie = (res, data) => {
  res.cookie("userData", JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
  });
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const signIn = async (req, res) => {
  console.log("entered signin POST form read");
  const { email, password, isVendor } = req.body;

  try {
    let user;
    if (isVendor) {
      user = await Vendor.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.json({ success: false, message: "Can't find email" });
    }

    const isMatch = await comparePassword(password, user.pass);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid password' });
    }

    const email_token = generateToken(email);
    const type_token = generateToken(isVendor ? "vendor" : "user");
    const user_id = generateToken(user._id);

    const userData = {
      email: email_token,
      type: type_token,
      user_id: user_id
    };

    // ✅ 1. Set cookie for web clients
    setAuthCookie(res, userData);

    // ✅ 2. Send tokens in response for mobile clients
    const template = getNewLoginEmailHTML(isVendor ? "Vendor" : "User", "https://printease.yashwanth.site");
    await sendEmail({
      to: email,
      subject: 'New Signin Detected',
      html: template,
    });

    return res.json({
      success: true,
      message: "Signin successful",
      tokens: userData, // for mobile
      email: user.email,
      role: isVendor ? "vendor" : "user"
    });

  } catch (err) {
    console.error('Error during signin:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const logout = async (req, res) => {
  console.log("logout encountered");

  res.clearCookie("userData", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.json({ success: true, message: "Logged out successfully" });
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const user_exists = async (req, res) => {
  console.log("inside userExists route");
  const { email, isVendor } = req.body;

  try {
    let user = isVendor 
      ? await Vendor.findOne({ email })
      : await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    return res.status(200).json({ message: 'continue' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const generate_otp = async (req, res) => {
  console.log("inside generateotp route");
  const { email, text } = req.body;

  function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  const otp = generateOTP();
  const otp_token = generateToken(otp);

  res.cookie("otp", otp_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  await sendEmail({
    to: email,
    subject: 'Your PrintEase OTP',
    text: `${otp}  ${text}\nDo not share with anybody`,
  });

  return res.status(200).json({ message: 'OTP sent successfully', otp_token }); // ✅ also send otp_token (mobile)
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const verify_otp = (req, res) => {
  const otpval = req.body.otp;
  const otp_json = verifyToken(req.cookies.otp || req.body.otp_token);

  if (!otp_json) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  if (otp_json.userId == otpval) {
    return res.status(200).json({ message: 'OTP is correct' });
  } else {
    return res.status(400).json({ message: 'Incorrect OTP. Try again.' });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const signUp = async (req, res) => {
  console.log("in signup POST read");
  const { email, password, isVendor, fullName, phone } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    let newUser;

    if (isVendor) {
      newUser = new Vendor({ email, pass: hashedPassword, name: fullName, phone });
    } else {
      newUser = new User({ email, pass: hashedPassword });
    }

    await newUser.save();

    const email_token = generateToken(email);
    const type_token = generateToken(isVendor ? "vendor" : "user");
    const user_id = generateToken(newUser._id);

    const userData = { email: email_token, type: type_token, user_id: user_id };

    // ✅ 1. Set cookie for web
    setAuthCookie(res, userData);

    // ✅ 2. Send tokens in response for mobile
    const template = getSignupSuccessEmailHTML(isVendor ? "Vendor" : "User", "https://printease.yashwanth.site");
    await sendEmail({
      to: email,
      subject: 'Registered for PrintEase',
      html: template,
    });

    return res.json({
      success: true,
      message: 'Registration successful',
      tokens: userData, // for mobile
      email: newUser.email
    });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const reset_password = async (req, res) => {
  const { email, password, isVendor } = req.body;
  const type = isVendor ? "Vendor" : "User";

  try {
    const user = isVendor 
      ? await Vendor.findOne({ email }) 
      : await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await hashPassword(password);
    user.pass = hashedPassword;
    await user.save();

    const emailHTML = getPasswordChangedEmailHTML(type, "https://printease.yashwanth.site");
    await sendEmail({
      to: email,
      subject: `✅ Password Changed Successfully - PrintEase ${type}`,
      html: emailHTML,
    });

    return res.status(200).json({ message: 'Password reset successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
const is_Authenticated = async (req, res) => {
  console.log("inside Authentication");
  try {
    let userData;

    // ✅ support both cookie (web) and header (mobile)
    if (req.cookies.userData) {
      userData = JSON.parse(req.cookies.userData);
    } else if (req.headers.authorization) {
      const tokens = JSON.parse(req.headers.authorization);
      userData = tokens;
    } else {
      return res.status(401).json({ authenticated: false, message: "No authentication token found" });
    }

    const typeDecoded = verifyToken(userData.type);
    if (!typeDecoded) {
      return res.status(401).json({ authenticated: false, message: "Invalid type token" });
    }

    return res.status(200).json({
      authenticated: true,
      role: typeDecoded.userId,
    });

  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ authenticated: false, message: "Authentication failed" });
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------
export {
  signIn,
  signUp,
  logout,
  user_exists,
  generate_otp,
  verify_otp,
  reset_password,
  is_Authenticated,
};
