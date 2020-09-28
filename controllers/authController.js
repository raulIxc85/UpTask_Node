const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs'); 
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para revisar si el usuario ha iniciado session
exports.usuarioAutenticado = ( req, res, next) => {
    //usuario autenticado
    if (req.isAuthenticated()){
        return next();
    }

    //usuario no autenticado
    return res.redirect('/iniciar-sesion');

}


exports.cerrarSesion = ( req, res ) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

//genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // existe el usuario
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email }});

    //si no existe usuario
    if(!usuario){
        req.flash('error','No existe la cuenta');
        res.redirect('/reestablecer');
    }


    //existe el usuario
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardar en la base
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
   // console.log(resetUrl);

   //envia el correo al usuario
   await enviarEmail.enviar({
       usuario,
       subject: 'Password Reset',
       resetUrl,
       archivo: 'reestablecer-password'
   });

   req.flash('correcto','Se envio un mensaje a tu correo');
   res.redirect('/iniciar-sesion');

}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    //si no existe el usuario
    if (!usuario){
        req.flash('error','No válido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer contraseña'
    })
}

//cambiar password por uno nuevo

exports.actualizarPassword = async (req, res) => {
    //verifica token valida y fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    //console.log(usuario);
    if (!usuario){
        req.flash('error','No válido');
        res.redirect('/reestablecer');
    }

    //hasheando nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //actualizando en la base   
    await usuario.save();

    req.flash('correcto', 'Su contraseña se ha actualizado correctamente');
    res.redirect('/iniciar-sesion');
    
}