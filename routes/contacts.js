module.exports = function(db) {
  const express = require('express');
  const router = express.Router();

  // Listar todos los contactos
  router.get('/', (req, res) => {
    db.query('SELECT * FROM agenda_contactos', (err, contacts) => {
      if (err) {
        // Manejar el error adecuadamente
        console.error(err);
        return res.status(500).send('Error al obtener los contactos');
      }

      // Renderizar la vista usando EJS y pasar los resultados de la consulta
      res.render('contact-list', { contacts: contacts });
    });
  });

  //Eliminar contacto
  router.delete('/:id', function(req, res) {
    const id = req.params.id;
    // Lógica para eliminar el contacto de la base de datos utilizando el id
    db.query('DELETE FROM agenda_contactos WHERE id = ?', [id], function(err, result) {
      if (err) {
        // Manejar el error
        console.error(err);
        res.status(500).send('Error al eliminar el contacto');
      } else {
        // Si todo va bien, redirigir al usuario de vuelta a la lista de contactos
        res.redirect('/contacts');
      }
    });
  });

  //MOdificar contacto

  // Ruta para mostrar la vista de modificación
  router.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM agenda_contactos WHERE id = ?', [id], (err, result) => {
        if (err) {
            // Manejar error
            return res.status(500).send('Error al obtener el contacto');
        }
        if (result.length > 0) {
            res.render('contact-edit', { contact: result[0] });
        } else {
            return res.status(404).send('Contacto no encontrado');
        }
    });
  });

  // Ruta para procesar la modificación
  router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, apellidos, correo, fecha_nac } = req.body;

    // Aquí se agrega la validación de los datos recibidos
    if (!nombre || !apellidos || !correo || !fecha_nac) {
      // Si alguno de los campos requeridos es nulo o undefined, enviar un mensaje de error
      return res.status(400).send('Todos los campos son requeridos.');
    }

    // Si todos los campos están presentes, proceder con la actualización
    db.query('UPDATE agenda_contactos SET nombre = ?, apellidos = ?, correo = ?, fecha_nac = ? WHERE id = ?', [nombre, apellidos, correo, fecha_nac, id], (err, result) => {
      if (err) {
        // Manejar el error si la consulta falla
        console.error(err);
        return res.status(500).send('Error al actualizar el contacto');
      }
      // Si la actualización es exitosa, redirigir al usuario a la lista de contactos
      res.redirect('/contacts');
    });
  });

  // Ruta para la búsqueda por apellidos
  router.get('/search', (req, res) => {
    const searchApellido = req.query.apellidos;
    const sql = 'SELECT * FROM agenda_contactos WHERE apellidos LIKE ?';
    const query = `%${searchApellido}%`; // Agrega comodines % para buscar apellidos parecidos
    
    db.query(sql, [query], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al buscar contactos por apellidos');
        }
        // Renderiza la vista con los resultados de la búsqueda
        res.render('contact-list', { contacts: results });
    });
  });
  return router;
};