const express = require('express');
const app = express();
const path = require('path');

// Configuración de las rutas
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Servir el archivo login.html
});
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html')); // Servir el archivo welcome.html
});

// El servidor está escuchando en el puerto 3002
app.listen(3000, () => console.log('Servidor abierto en http://localhost:3000'));

