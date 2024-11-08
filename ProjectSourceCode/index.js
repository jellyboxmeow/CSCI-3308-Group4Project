
const pokemon = require('pokemontcgsdk');
const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

pokemon.configure({ apiKey: process.env.API_KEY })

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/src/views/layouts',
  partialsDir: __dirname + '/src/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here
app.get('/', (req, res) => {
  res.redirect('/anotherRoute'); //this will call the /anotherRoute route in the API
});

app.get('/anotherRoute', (req, res) => {
  //do something
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('pages/login', { error: null })
});

app.get('/register', (req, res) => {
  res.render('pages/register', { error: null })
});

app.get('/friends', (req, res) => {
  res.render('pages/friends', { error: null })
});

// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);

  const queryText = 'INSERT INTO users (username, password) VALUES ($1, $2)';
  await db.none(queryText, [req.body.username, hash]);

  res.redirect('/login');

});

app.post('/login', async (req, res) => {
  // Define the SQL query to fetch the user with the provided username
  const query = 'SELECT * FROM users WHERE username = $1';

  // Query the database for the user. If the user does not exist, 'db.oneOrNone' will return null.
  const user = await db.oneOrNone(query, [req.body.username]);

  // Compare the hashed password from the database with the one provided in the login form
  if (user) {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      req.session.user = user; // Store user data in the session
      req.session.save(() => {
        res.redirect('/friends'); // Redirect to /friends on successful login
      });// Redirect to the 'home' page after successful login
    } else {
      res.render('pages/login'); // Render the login page with an error message
    }
  } else {
    res.redirect('/register'); // Redirect the user to the registration page
  }
});




// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

app.get('/collection', (req, res) => {
  pokemon.card.find('base1-4')
    .then(card => {
      console.log(card.name) // "Charizard"
    })
  res.render('pages/collection', { error: null })
});

// Authentication Required
app.use(auth);
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');
