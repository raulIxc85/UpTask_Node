const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmltotext = require('html-to-text');
const util = require('util');
const emailconfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailconfig.host,
    port: emailconfig.port,
    auth: {
      user: emailconfig.user,
      pass: emailconfig.pass,
    },
});

const generarHTML = (archivo, opciones={}) => {
  const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`,opciones);
  return juice(html);
}


exports.enviar = async (opciones) => {
  const html = generarHTML(opciones.archivo, opciones); // html body
  const text = htmltotext.fromString(html); // plain text body

  let info = {
      from: 'UpTask <no-reply@uptask.com>', // sender address
      to: opciones.usuario.email, // list of receivers
      subject: opciones.subject, // Subject line
      text,
      html 
  };

  const enviarEmail = util.promisify(transport.sendMail, transport);
  return enviarEmail.call(transport,info);
  
}



  
  