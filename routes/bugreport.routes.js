import express from "express";
const router = express.Router();
import { sendEmail } from '../utils/email.js';

router.post('/',async(req,res)=>{
    console.log("into the route");
    try{
      const {text} = req.body;
      const email = "yashwanthmunikuntla@gmail.com";
      await sendEmail({
        to: email,
        subject: 'BugReport',
        html: text,
      });

      res.status(200).json({ message: 'Email sent successfully' });
    }catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});

export default router;