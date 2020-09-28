const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email')

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta'
    });
}

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Session',
        error
    });
}

exports.crearCuenta = async (req,res) => {
    //leer los campos
    const { email,password} = req.body;

    try {
         //guardar en la tabla
        await  Usuarios.create({
            email,
            password
        });

        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto usuario
        const usuario = {
            email
        }

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        req.flash('correcto','Se envío un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion')
    }catch (error){
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta',
            email,
            password
        });
    }
   
   
}

exports.formRestablecerPassword = ( req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer Contraseña'
    });
}

//Cambiar el estado de la cuenta, activar cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if (!usuario){
        req.flash('error','No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto','Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}