const express = require('express');
const app = express();
const path = require('path');
require('colors');  // Requiere el paquete colors para usar colores en la consola

// Establecer EJS como motor de plantillas
app.set('view engine', 'ejs');

// Configuración de las rutas
app.get('/', (req, res) => res.redirect('/login'));  // Redirige la raíz a la página de login

// Ruta para mostrar el formulario de login
app.get('/login', (req, res) => {
    // Renderiza la vista 'login' y pasa un mensaje dinámico a la vista
    res.render('login', { message: 'Bienvenido, ingresa tus datos.' });
});

// Ruta para mostrar la página de bienvenida
app.get('/welcome', (req, res) => {
    // Obtiene el parámetro 'name' de la consulta, o usa 'Usuario' si no se proporciona
    const name = req.query.name || 'Usuario';
    
    // Renderiza la vista 'welcome' y pasa el mensaje de éxito y el nombre de usuario dinámicamente
    res.render('welcome', { 
        successMessage: '¡Tu cuenta ha sido creada exitosamente!',
        name: name
    });
});

// El servidor está escuchando en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor abierto en http://localhost:3000'.green);  // Mensaje en verde
});

