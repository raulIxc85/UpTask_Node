const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//variables de entorno.env
require('dotenv').config({ path: 'variables.env'});

//helpers con algunas funciones
const helpers = require('./helpers');

//conexion a base de datos
const db = require('./config/db');

//importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));


// crear una app express
const app = express();

//donde cargar archivos estaticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine','pug');

//habilitar body parser para lectura de datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//agregamos validator a toda la aplicacion
//app.use(expressValidator());


//añadir carpeta vistas
app.set('views',path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//crear sessiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la aplicacion
app.use((req,res,next) => {   
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})


app.use('/',routes());

//app.listen(4000);

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

app.listen(port,host,() => {
    console.log('El servidor esta en linea');
})


