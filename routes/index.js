const express = require('express');
const router = express.Router();

const { body } = require('express-validator/check');

const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    // ruta para el home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
        
    );

    router.get('/nuevo-proyecto', 
    authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );
    
    // listar proyectos
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );
    
    // actualizar proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );

    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );
    
    //eliminar proyectos

    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,    
        proyectosController.eliminarProyecto
    );
    
    //tareas

    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    //Actualizar tareas
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    //Eliminar tareas
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );


    //crear cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //iniciar session
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    
    //cerrar session
    router.get('/cerrar-sesion',authController.cerrarSesion);

    //restablecer contraseña
    router.get('/reestablecer',usuariosController.formRestablecerPassword);
    router.post('/reestablecer',authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router;
}