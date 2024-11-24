const nodemailer = require('nodemailer');

function sendOtp(maildId,otp){
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail service
    auth: {
      user: "khawatech@gmail.com", // Your Gmail email address
      pass: "xiwt wimx"   // Your Gmail password (or app password if 2FA is enabled)
    }
  });
  
  // Define email options
  const mailOptions = {
    from: "khawatech@gmail.com", // Must be your Gmail address
    to: maildId ,  // Recipient's email
    subject:otp,
    text: `this is your otp`
  };
  
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
     
       console.log(error)
    } else {
      console.log(info.response) 
    }
  })
  

}
 //console.log(mailId,otp)
// Set up the transporter using Gmail's SMTP settings
module.exports=sendOtp
