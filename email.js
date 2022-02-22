const nodemailer = require('nodemailer');

function enviar_email(correos, asunto, contenido) {

    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mbensan.test@gmail.com',
            pass: "mbensan.2022",
        }
    })

    const options = {
        from: 'mbensan.test@gmail.com',
        to: correos,
        subject: asunto,
        html: contenido
    }

    transporter.sendMail(options, function() {
        console.log('Correo enviado');
    })
}

module.exports = enviar_email;
