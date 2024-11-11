
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
    saveUninitialized: true,
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

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
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
  res.render('pages/friends', { error: null, friendsList: req.session.friends || []})
});

// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  try{
    const { username, password } = req.body;
    
    // Ensure username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Hash the password using bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Check if the username already exists in the database
    const userCheckQuery = 'SELECT * FROM users WHERE username = $1';
    const existingUser = await db.oneOrNone(userCheckQuery, [username]);
    if (existingUser) {
      return res.status(400).redirect('/register');
    }

    // Insert new user into the database
    const queryText = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await db.none(queryText, [username, hash]);

    // Respond with success message
    // res.status(200).json({ message: 'Success' });
    console.log('Redirecting to /login');
    return res.status(302).redirect('/login');
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
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
      req.session.save(async () => {
        const friendsListQuery = 'SELECT users.username FROM friends INNER JOIN users \
        ON users.users_id = friends.friend_id WHERE friends.user_id = $1 \
        AND users.username != $2\
        UNION \
        SELECT users.username FROM friends INNER JOIN users ON \
        users.users_id = friends.user_id WHERE friends.friend_id = $1 \
        AND users.username != $2;';
        // const friendsListQuery = 'SELECT username FROM users WHERE users_id != $1';
        const friendsList = await db.any(friendsListQuery, [user.users_id, user.username]);
        req.session.friends = friendsList.map(friend => friend.username); // Extract only the usernames;
        console.log(friendsList); // checking results
        console.log(req.session.friends); //debugging session friends
        req.session.save(()=>{
          return res.status(302).redirect('/friends'); // Redirect to /friends on successful login
        });
      });// Redirect to the 'home' page after successful login
    } else {
        return res.status(400).redirect('/login'); // Render the login page with an error message
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
  axios({
    url: 'https://api.pokemontcg.io/v2/cards?q=name:charizard&page=1&pageSize=25',
    method: 'GET',
  })
    .then(results => {
      console.log(results.data); // the results will be displayed on the terminal if the docker containers are running
      res.render('pages/collection', { cards: results.data.data });
    })
    .catch(error => {
      // Handle errors
      res.status(400);
    });
});

// Authentication Required
app.use(auth);
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
// app.listen(3000);
console.log('Server is listening on port 3000');
