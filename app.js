const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const colors = require('colors'); // Importar colors para los colores en consola

// Establecer EJS como motor de plantillas
app.set('view engine', 'ejs');

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Cambia esto si es necesario
  password: 'david',  // Cambia esto por tu contraseña si es necesario
  database: 'jefe'  // Nombre de la base de datos 'jefe'
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    // Si hay un error de conexión, lo mostramos en rojo
    console.log('Error de conexión: '.red, err);
    return;
  }
  // Si la conexión es exitosa, mostramos el mensaje en verde
  console.log('Conexión exitosa a la base de datos MySQL'.green);
});

// Middleware para manejar datos del cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }));

// Ruta raíz, redirige a la ruta de login
app.get('/', (req, res) => res.redirect('/login'));

// Ruta de login
app.get('/login', (req, res) => {
  res.render('login', { message: 'Bienvenido, ingresa tus datos.' });
});

// Procesamiento del formulario de login
app.post('/login', (req, res) => {
  const { nombre, cedula } = req.body;

  if (!nombre || !cedula) {
    return res.render('login', { message: 'Por favor, ingresa todos los campos.' });
  }

  const query = 'SELECT * FROM usuarios WHERE (nombre1 = ? OR nombre2 = ? OR nombre3 = ? OR nombre4 = ?) AND cedula = ?';
  db.execute(query, [nombre, nombre, nombre, nombre, cedula], (err, results) => {
    if (err) {
      // Si ocurre un error en la consulta, mostramos el mensaje en rojo
      console.log('Error de consulta: '.red, err);
      return res.render('login', { message: 'Ocurrió un error al intentar hacer login.' });
    }

    if (results.length === 0) {
      // Si no se encuentra al usuario, mostramos un mensaje en amarillo
      console.log('Usuario no encontrado.'.yellow);
      return res.render('login', { message: 'Usuario no encontrado. Intenta de nuevo.' });
    }

    const user = results[0];

    // Si las credenciales son correctas, redirigir al usuario a la página de bienvenida
    console.log(`Usuario ${user.nombre1} encontrado, redirigiendo...`.green);
    res.redirect(`/welcome?name=${user.nombre1}&cedula=${user.cedula}`);
  });
});

// Ruta para la página de bienvenida
app.get('/welcome', (req, res) => {
  const { name, cedula } = req.query;
  res.render('welcome', {
    successMessage: '¡Tu cuenta ha sido creada exitosamente!',
    name: name,
    cedula: cedula
  });
});

// Ruta para obtener los datos del usuario
app.get('/get-user-data', (req, res) => {
  const { nombre, cedula } = req.query;

  // Verifica si ambos parámetros fueron enviados
  if (!nombre || !cedula) {
    // Si faltan parámetros, mostramos un mensaje en rojo
    return res.status(400).send('Faltan parámetros: nombre o cédula.'.red);
  }

  // Consulta SQL para obtener los datos del usuario basado en nombre y cédula
  const query = 'SELECT * FROM usuarios WHERE (nombre1 = ? OR nombre2 = ? OR nombre3 = ? OR nombre4 = ?) AND cedula = ?';
  db.execute(query, [nombre, nombre, nombre, nombre, cedula], (err, results) => {
    if (err) {
      // Si ocurre un error en la consulta, mostramos el mensaje en rojo
      console.log('Error al obtener datos del usuario: '.red, err);
      return res.status(500).send('Error al obtener los datos.'.red);
    }

    if (results.length === 0) {
      // Si no se encuentra al usuario, mostramos un mensaje en amarillo
      return res.status(404).send('Usuario no encontrado.'.yellow);
    }

    const user = results[0];

    // Eliminar el campo id
    delete user.id;

    // Formatear la fecha de nacimiento (quitar la parte de la hora)
    const formattedDate = new Date(user.fecha_nacimiento).toLocaleDateString('es-CO');

    // Actualizar el objeto con la fecha formateada
    user.fecha_nacimiento = formattedDate;

    // Enviar los datos del usuario sin el id y con la fecha formateada
    console.log('Datos del usuario enviados exitosamente.'.green);
    res.json(user);
  });
});

// Configurar el servidor
app.listen(3000, () => {
  // Mensaje de inicio del servidor en verde
  console.log('Servidor abierto en http://localhost:3000'.green);
});


