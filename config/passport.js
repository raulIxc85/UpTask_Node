const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuarios = require('../models/Usuarios');

passport.use(
        new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try{
                const usuario= await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //usuario no existe -- password incorrecto
                if (!usuario.verificarPassword(password)){
                    return done(null,false, {
                        message: 'Password incorrecto'
                    })
                }
                return done(null, usuario);
            }catch (error){
                //usuario no existe
                return done(null,false, {
                    message: 'Cuenta no existe'
                })
            }
        }
        
    )
);

//serializar usuario

passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//deserialzar usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;