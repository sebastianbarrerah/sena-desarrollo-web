// importaciones
const express = require('express');
const bodyParser = require('body-parser');
const nuevo = require('./database/shemasTypes');
const app = express();

// configuracion
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// peticiones
app.post('/home', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Aqui buscamos si el email y la contraseña existen en la base de datos
    const usuario = await nuevo.findOne({ email });

    if (usuario) {
      console.log("aprobo el correo");
      if (usuario.password == password) {
        res.redirect('/home');

      } else {
        res.redirect('/password');
      }
    } else {
      res.redirect('/register')
    }
  } catch (error) {
    console.error('Error al buscar usuario:', error);
  }
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let nuevoUsuario = new nuevo({ email, password });
    await nuevoUsuario.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error al crear usuario:', error);

    res.redirect('/register');
  }
});


// rutas
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/welcome.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.get('/password', (req, res) => {
  res.sendFile(__dirname + '/public/password.html');
});

app.listen(app.get('port'), () => {
  console.log("La app está corriendo en el puerto 3000");
});

// adpoints
app.get('/users', async (req, res) => {
  try {
    const users = await nuevo.find();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para buscar un usuario por su correo electrónico
app.get('/userByEmail', async (req, res) => {
  try {
    const { email } = req.query; 
    const user = await nuevo.findOne({ email }); // Buscar el usuario por su email en la base de datos
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    res.status(500).send('Error interno del servidor');
  }
});
