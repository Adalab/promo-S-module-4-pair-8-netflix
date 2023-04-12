const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: '10mb' }));
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

/* server.get('/movies', function (req, res) {
  res.json({
    success: true,
    movies: [
      {
        id: '1',
        title: 'Gambita de dama',
        genre: 'Drama',
        image:
          '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/images/gambito-de-dama.jpg',
      },
      {
        id: '2',
        title: 'Friends',
        genre: 'Comedia',
        image:
          '//beta.adalab.es/curso-intensivo-fullstack-recursos/apis/netflix-v1/images/friends.jpg',
      },

    ],
  });
}); */

let connection;

mysql
  .createConnection({
    host: 'sql.freedb.tech',
    database: 'freedb_Netflix_',
    user: 'freedb_NattaB',
    password: 'Vk2vHrmby!U@H9x',
  })
  .then((conn) => {
    connection = conn;
    connection
      .connect()
      .then(() => {
        console.log('Conectado con el identificador ' + conn.threadId);
      })
      .catch((err) => {
        console.error('Error de conexion: ' + err.stack);
      });
  })
  .catch((err) => {
    console.error('Error de configuración: ' + err.stack);
  });

server.get('/movies', (req, res) => {
  console.log('Pidiendo a la base de datos información de las tarjetas.');
  let genreFilterParam = req.query.genre;
  let sortFilterParam = req.query.sort;
  console.log(sortFilterParam);

  if (!genreFilterParam) {
    genreFilterParam = '%';
  }
  console.log(genreFilterParam);
  connection
    .query(
      `SELECT * FROM MOVIES WHERE genre LIKE ?ORDER BY title ${sortFilterParam}`,
      [genreFilterParam]
    )
    .then(([results, fields]) => {
      console.log('Información recuperada:');
      results.forEach((result) => {
        console.log(result);
      });

      res.json({
        success: true,
        movies: results,
      });
    })
    .catch((err) => {
      throw err;
    });
});

//copiado apuntes para modificar para el login
server.post('/login', (req, res) => {
  console.log('Body params:', req.body);
  console.log('Body param password:', req.body.password);
  console.log('Body param Email:', req.body.email);
  let email = req.body.email;
  let password = req.body.password;
  connection
    .query(`SELECT * FROM USERS WHERE email = ? AND password  = ?`, [
      email,
      password,
    ])
    .then(([results]) => {
      console.log('Información recuperada:');
      console.log(results);
      if (results.length === 0) {
        res.json({
          success: false,
          errorMessage: 'Usuaria/o no encontrada/o',
        });
      } else {
        res.json({
          success: true,
          userId: results[0].idUser,
        });
      }
    })
    .catch((err) => {
      throw err;
    });
});

server.get('/movie/:movieId', (req, res) => {
  const foundMovie = req.params.movieId;
  console.log(req.params.movieId);
  connection
    .query(`SELECT * FROM MOVIES WHERE id = ?`, [foundMovie])
    .then(([results, fields]) => {
      res.render('movie', results[0]);
    })
    .catch((err) => {
      throw err;
    });
});

/* const port = process.env.PORT||4000;
const dbConnect = require('../config/connection');
dbConnect();

app.listen (port, () => {
  console.log('servidor a su servicio en el puerto', PORT);
}) */

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathWebImages = './src/public-movies-images'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWebImages));

// const staticServerPathWebStyle = './src/public-movies-style'; // En esta carpeta ponemos los ficheros estáticos
// server.use(express.static(staticServerPathWebStyle));

server.use(express.static('./src/public-movies-style'));