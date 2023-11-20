const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public')); 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Conectar a la base de datos MySQL
const db = mysql.createConnection({
  host: 'rds-mysql-pc03.cc6esuxhnwkq.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'tecsup2023',
  database: 'dbtecsup'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a MySQL');
});

// Importar y usar rutas con la conexión db
const contactsRouter = require('./routes/contacts')(db); // Asegúrate de pasar 'db' aquí
app.use('/contacts', contactsRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
