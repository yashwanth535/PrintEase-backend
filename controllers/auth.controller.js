const {Vendor, Customer } = require('../models/User_Collection');
const { comparePassword } = require('../middleware/bcrypt');
const { hashPassword } = require('../middleware/bcrypt');
const { generateToken ,verifyToken} = require("../config/jwt");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// ---------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------------------
const signIn = async (req, res) => {
  console.log("entered signin POST form read");
  const { email, password,isVendor} = req.body;

  try {
    let user;
    if(isVendor){
      user = await Vendor.findOne({ email: email});
    }
    else{
      user = await Customer.findOne({ email: email });
    }
    if (user) {
      const isMatch = await comparePassword(password, user.pass);
      if (isMatch) {
          const token = generateToken(email);
          res.cookie("db", token, {
              httpOnly: true, // Secure, prevents XSS
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
              maxAge: 15 * 24 * 60 * 60 * 1000 
          });
        res.json({ success: true, email: user.email });
      } 
      else {
        res.json({ success: false, message: 'Invalid password' });
      }
    } else {
      res.json({ success: false, message: "Can't find email" });
    }
  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------
const logout = async (req, res) => {
  console.log("logout encountered");
  res.clearCookie("db", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Must match the cookie settings
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
};


// ---------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------------

const user_exists=async (req, res) => {
  console.log("inside userExists route");
  const { email, isVendor } = req.body;

  try {

    if(isVendor){
      user = await Vendor.findOne({ email: email});
    }
    else{
      user = await Customer.findOne({ email: email });
    }

    if (user) {
      console.log("user exists");
      return res.status(400).json({ message: 'Email is already registered.' });
    }
    console.log("user not registered");
    return res.status(200).json({message:'continue'});

  }
  catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const generate_otp=async (req, res) => {
            
  console.log("inside generateotp route");
  const { email,text} = req.body;
  console.log("email is "+email);
  console.log("text is "+text);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.user,
      pass: process.env.pass, 
    },
  });

  function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string if needed
  }

  const otp = generateOTP();
  
  console.log("otp is:" + otp);
  const otp_token = generateToken(otp);
  res.cookie("otp", otp_token, {
      httpOnly: true, // Secure, prevents XSS
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 604800000
  });

  // Email options
  const mailOptions = {
    from: '"moneymind" <verify.moneymind@gmail.com>', // Corrected email format
    to: email, // Recipient's email address
    subject: 'OTP verification!', // Subject of the email
    text: otp +"  "+text+"\n Do not share with any body", // Plain text body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("not success");
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    console.log("success");
    return res.status(200).json({ message: 'OTP sent successfully' }); // Send a success response
  });
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const verify_otp=(req,res)=>{
  const otpval=req.body.otp;
  console.log('recieved otp is '+otpval);
  const otp_json = verifyToken(req.cookies.otp);
  if (!otp_json) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
}
  console.log(otp_json.userId);
  if(otp_json.userId==otpval){
    console.log("otp is correct");
    res.status(200).json({message : 'otp is correct'});
  }
  else {
    console.log("otp is not correct");
    res.status(400).json({message : 'The provided OTP is incorrect. Please try again.'});
  }
};

// ---------------------------------------------------------------------------------------------------------------------------------------

const signUp = async (req, res) => {
  console.log("in signup POST read");
  const { email, password, isVendor } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    let newUser; // Declare it before the if-else

    if (isVendor) {
      newUser = new Vendor({ email: email, pass: hashedPassword });
    } else {
      newUser = new Customer({ email: email, pass: hashedPassword });
    }

    await newUser.save(); // Save after assigning newUser
    const token = generateToken(email);
    res.cookie("db", token, {
        httpOnly: true, // Secure, prevents XSS
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 15 * 24 * 60 * 60 * 1000 
    });
    res.json({ email: newUser.email, message: 'Registration successful, please login' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Internal Server Error');
  }
};


// ---------------------------------------------------------------------------------------------------------------------------------------

const reset_password=async (req,res)=>{
  const { email, password ,isVendor} = req.body;
  try {
    let user;
    if(isVendor){
      user=await Vendor.findOne({email});
    }
    else{
      user=await Customer.findOne({email});
    }
    const hashedPassword = await hashPassword(password);
    user.pass = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
}
}
// ---------------------------------------------------------------------------------------------------------------------------------------
const is_Authenticated = async (req, res) => {
  console.log("inside Authentication");
  try {
    const db_json = verifyToken(req.cookies.db); // Verify and decode the JWT
    console.log(db_json);
    if (db_json) {
      return res.status(200).json({ authenticated: true, user: db_json });
    } else {
      return res.status(401).json({ authenticated: false, message: "Invalid token" });
    }
  } catch (error) {
    return res.status(401).json({ authenticated: false, message: "Authentication failed" });
  }
};



// ---------------------------------------------------------------------------------------------------------------------------------------
module.exports = {
  signIn,
  signUp,
  logout,
  user_exists,
  generate_otp,
  verify_otp,
  reset_password,
  is_Authenticated,
};
