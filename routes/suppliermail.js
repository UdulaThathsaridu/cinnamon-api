const expressAsyncHandler = require("express-async-handler");

const router = require('express').Router();;

const nodemailer = require('nodemailer');





// Create a Nodemailer transporter

let transporter = nodemailer.createTransport({

  service: 'gmail',

  host: 'smtp.gmail.com', // e.g., 'gmail'

  port: 587,

  secure : false,

  auth: {

    user: 'clicksbyrajana@gmail.com',

    pass: 'lsot zrlf hgdp cvoh',

  },

});

 

router.post('/sendemail', async (req, res) => {

  const { email, itemName, quantity } = req.body;

  console.log(email, itemName, quantity);



  var mailOptions = {

    from: 'clicksbyrajana@gmail.com',

    to: email,

    subject: "Items coming",

    text: `Item name: ${itemName} and Quantity: ${quantity}`,

  };



  transporter.sendMail(mailOptions, function (error, info) {

    if (error) {

      console.log(error);

    } else {

      console.log("Email sent successfully!");

    }

  });

});

 

module.exports = router;