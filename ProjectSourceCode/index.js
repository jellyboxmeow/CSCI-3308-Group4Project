
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
app.use(express.static(path.join(__dirname, '/src/resources/css')));

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
  res.json({ status: 'success', message: 'Welcome!' });
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
  if(!req.session.user){
    return res.redirect('/login');
  }
  else{
    res.render('pages/friends', { user: req.session.user, error: null, friendsList: req.session.friends || []})
  }
});

//Need to add can add yourself to your own friends list
app.post('/add-friend', async (req, res) => {
  const {users_id, friend_username} = req.body;
  if(!users_id || !friend_username){
    if(!users_id && !friend_username){
      return res.status(400).json({ success: false, message: 'users_id and friendUsername not passed' });
    }
    else if(!users_id){
      return res.status(400).json({ success: false, message: 'users_id not passed' });
    }
    return res.status(400).json({ success: false, message: 'friend_username not passed' });
  }

  // console.log('Current User ID:', users_id);
  // console.log('Friend Username:', friend_username);
  try{
    const friendQuery = 'SELECT users_id FROM users WHERE username = $1';
    const friend = await db.oneOrNone(friendQuery, [friend_username]);
    if(!friend){
      return res.status(400).json({success: false, message: 'Please enter a valid user'});
    }
    //checking for if someone put themselves as a friend
    if(friend.users_id == users_id){
      return res.status(400).json({success: false, message: 'You can not be friends with yourself'});
    }

    //have check for if already friends
    const checkFriendsTable = 'SELECT 1 FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)';
      //SELECT 1 is for checking if there exists any rows
    const check = await db.any(checkFriendsTable, [users_id, friend.users_id]);
    if(check.length > 0){
      return res.status(400).json({success: false, message: 'You already added them. Reload the page'});
    }
    const friend_id_in_users_table = friend.users_id;
    await db.none('INSERT INTO friends(user_id, friend_id) VALUES ($1, $2)', [users_id, friend_id_in_users_table]);

    const updatedFriendsQuery = 'SELECT u.username FROM users u JOIN friends f on f.friend_id = u.users_id WHERE f.user_id = $1';
    const friendsList = await db.any(updatedFriendsQuery, [users_id]);

    req.session.friends = friendsList.map(friend => friend.username);

    return res.status(200).json({success: true, message: 'Friend added successfuly. Reload the page if you do not see them'});
    // return res.redirect('/friends');
  }catch (err){
    console.error(err);
    return res.status(500).json({success: false, message: err.message || err});
  }
  // return res.status(200).json({ success: true, message: 'Friend added successfully' });
});

// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  try {
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
  } catch (err) {
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
          return res.status(302).redirect('/home'); // Redirect to /friends on successful login
        });
      });// Redirect to the 'home' page after successful login
    } else {
      return res.status(400).redirect('/login'); // Render the login page with an error message
    }
  } else {
    res.redirect('/register'); // Redirect the user to the registration page
  }
});

<<<<<<< HEAD
app.get('/friends', (req, res) => {
  res.render('pages/friends', { error: null })
});



=======
>>>>>>> 202a8ad93230c509e01ec1c7a926ac7c77524483
// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

<<<<<<< HEAD
app.get('/search', (req, res) => {
  const name = req.query.search;
  const card_name = req.query.card_name
  const card_image = req.query.card_image
  const card_rarity = req.query.card_rarity
  const card_price = req.query.card_price
  const card_set = req.query.card_set
  console.log('Name:', name);
  console.log('Card name: ', card_name)
  console.log('Card image: ', card_image)
  console.log('Card rarity: ', card_rarity)
  console.log('Card price: ', card_price)
  console.log('Card set: ', card_set)

=======
app.use('/friends', auth);
app.use('/search', auth);
app.use('/profile', auth);
app.use('/home', auth);
app.use('/logout', auth);

app.get('/profile', (req, res) => {
  res.render('pages/profile', { user: req.session.user, error: null })
});

app.get('/home', (req, res) => {
  res.render('pages/home', { user: req.session.user, error: null})
});

app.get('/search', (req, res) => {
  const name = req.query.search;
  console.log(name);
>>>>>>> 202a8ad93230c509e01ec1c7a926ac7c77524483
  axios({
    url: 'https://api.pokemontcg.io/v2/cards',
    method: 'GET',
    params: {
      q: `name:${name}*`
    }
  })
    .then(results => {
<<<<<<< HEAD
      console.log(results.data);
      res.render('pages/search', { cards: results.data.data });
=======
      console.log(results.data); // the results will be displayed on the terminal if the docker containers are running
      res.render('pages/search', { user: req.session.user , cards: results.data.data});
>>>>>>> 202a8ad93230c509e01ec1c7a926ac7c77524483
    })
    .catch(error => {
      // Handle errors
      res.status(400);
    });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
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
