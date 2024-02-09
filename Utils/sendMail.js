const nodemailer = require("nodemailer");

async function sendMail(email,title,body){
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,

            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
          });

          const info = await transporter.sendMail({
            from: 'BHARAT - AID', // sender address
            to: `${email}`, // list of receivers
            subject: `${title}`, // Subject line
            html: `${body}`, // html body
          });

          return info;
    }catch(error){
        console.log(error);
        return;
    }
}

module.exports = sendMail;