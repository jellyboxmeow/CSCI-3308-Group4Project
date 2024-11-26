
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
const { exists } = require('fs');


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

app.get('/friends', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  try {
    const userId = req.session.user.users_id;
    const username = req.session.user.username;
    // Fetch list of users that are friends
    const friendsListQuery = 'SELECT users.username FROM friends INNER JOIN users \
      ON users.users_id = friends.friend_id WHERE friends.user_id = $1 \
      AND users.username != $2\
      UNION \
      SELECT users.username FROM friends INNER JOIN users ON \
      users.users_id = friends.user_id WHERE friends.friend_id = $1 \
      AND users.username != $2;';
    const friendsList = await db.any(friendsListQuery, [userId, username]);
    req.session.friends = friendsList.map(friend => friend.username); // Extract only the usernames

    // Fetch list of users who are not friends
    const unfriendedQuery = `SELECT username FROM users\
      WHERE users_id != $1\
      AND users_id NOT IN (\
        SELECT friend_id FROM friends WHERE user_id = $1\
        UNION\
        SELECT user_id FROM friends WHERE friend_id = $1\
      );`;
    const unfriendedList = await db.any(unfriendedQuery, [userId]);
    req.session.unfriendedList = unfriendedList.map(user => user.username);

    console.log(req.session.friends);

    res.render('pages/friends', {
      user: req.session.user,
      error: null,
      friendsList: req.session.friends || [],
      unfriendedList: req.session.unfriendedList || []
    });
  } catch {
    console.error(err);
    res.status(500).render('pages/friends', { error: 'An error occurred while fetching friends data.' });
  }
});

//Need to add can add yourself to your own friends list
app.post('/add-friend', async (req, res) => {
  const { users_id, friend_username } = req.body;
  if (!users_id || !friend_username) {
    if (!users_id && !friend_username) {
      return res.status(400).json({ success: false, message: 'users_id and friendUsername not passed' });
    }
    else if (!users_id) {
      return res.status(400).json({ success: false, message: 'users_id not passed' });
    }
    return res.status(400).json({ success: false, message: 'friend_username not passed' });
  }

  // console.log('Current User ID:', users_id);
  // console.log('Friend Username:', friend_username);
  try {
    const friendQuery = 'SELECT users_id FROM users WHERE username = $1';
    const friend = await db.oneOrNone(friendQuery, [friend_username]);
    if (!friend) {
      return res.status(400).json({ success: false, message: 'Please enter a valid user' });
    }
    //checking for if someone put themselves as a friend
    if (friend.users_id == users_id) {
      return res.status(400).json({ success: false, message: 'You can not be friends with yourself' });
    }

    //have check for if already friends
    const checkFriendsTable = 'SELECT 1 FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)';
    //SELECT 1 is for checking if there exists any rows
    const check = await db.any(checkFriendsTable, [users_id, friend.users_id]);
    if (check.length > 0) {
      return res.status(400).json({ success: false, message: 'You already added them' });
    }
    const friend_id_in_users_table = friend.users_id;
    await db.none('INSERT INTO friends(user_id, friend_id) VALUES ($1, $2)', [users_id, friend_id_in_users_table]);

    // const updatedFriendsQuery = 'SELECT u.username FROM users u JOIN friends f on f.friend_id = u.users_id WHERE f.user_id = $1';
    const updatedFriendsQuery = 'SELECT users.username FROM friends INNER JOIN users \
        ON users.users_id = friends.friend_id WHERE friends.user_id = $1 \
        UNION \
        SELECT users.username FROM friends INNER JOIN users ON \
        users.users_id = friends.user_id WHERE friends.friend_id = $1;';
    const friendsList = await db.any(updatedFriendsQuery, [users_id]);

    req.session.friends = friendsList.map(friend => friend.username);

    return res.status(200).json({ success: true, message: 'Friend added successfuly. Reload the page if you do not see them' });
    // return res.redirect('/friends');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message || err });
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
      return res.status(400).redirect('/login');
    }

    const queryDeck = 'INSERT INTO deck DEFAULT VALUES RETURNING deck_id'
    await db.one(queryDeck)

    // Insert new user into the database
    const queryText = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING deck_id';
    await db.one(queryText, [username, hash]);

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
      // console.log(friendsList); // checking results
      // console.log(req.session.friends); //debugging session friends
      req.session.save(() => {
        return res.status(302).redirect('/home'); // Redirect to /friends on successful login
      });
      // });// Redirect to the 'home' page after successful login
    } else {
      return res.status(400).redirect('/login'); // Render the login page with an error message
    }
  } else {
    res.redirect('/register'); // Redirect the user to the registration page
  }
});

// 202a8ad93230c509e01ec1c7a926ac7c77524483
// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

app.use('/friends', auth);
app.use('/search', auth);
app.use('/profile', auth);
// app.use('/home', auth);
app.use('/logout', auth);
app.use('/forms', auth);

app.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');  // Redirect if there's no user in session
  }
  console.log('User in session:', req.session.user);  // Debugging line
  // console.log(res.json(req.session.user));
  const query_exists = 'SELECT COUNT(*) from trade_cards'
  const exists = await db.one(query_exists)
  var button
  var opp_button
  if (exists.count == 0) {
    button = 'block'
    opp_button = 'none'
  }
  else {
    button = 'none'
    opp_button = 'block'
  }
  console.log('Display method: ', button)
  const query = 'SELECT * from cards INNER JOIN deck_cards ON cards.id = deck_cards.card_id INNER JOIN deck ON deck_cards.deck_id = deck.deck_id INNER JOIN users ON deck.deck_id = users.deck_id WHERE users.username = $1'
  const cards = await db.any(query, [req.session.user.username]);
  const queryprice = 'SELECT SUM(cards.card_price) from cards INNER JOIN deck_cards ON cards.id = deck_cards.card_id INNER JOIN deck ON deck_cards.deck_id = deck.deck_id INNER JOIN users ON deck.deck_id = users.deck_id WHERE users.username = $1'
  const price = await db.any(queryprice, [req.session.user.username]);
  // console.log('price: ', price)
  // console.log('cards: ', cards)
  res.render('pages/profile', { user: req.session.user, cards: cards, price: price, error: null, display: button, opp_display: opp_button })
});

app.get('/friendscollection', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');  // Redirect if there's no user in session
  }
  const query_exists = 'SELECT COUNT(*) from trade_cards'
  const exists = await db.one(query_exists)
  var button
  if (exists.count == 0) {
    button = 'none'
  }
  else {
    button = 'block'
  }
  console.log('Display method: ', button)
  const username = req.query.friend_username
  console.log('Friend Collection: ', username)
  const query_deck_id = 'SELECT deck_id from users WHERE username = $1'
  const deck_id = await db.one(query_deck_id, [username])
  console.log('deck id: ', deck_id)
  // console.log(res.json(req.session.user));
  const query = 'SELECT * from cards INNER JOIN deck_cards ON cards.id = deck_cards.card_id INNER JOIN deck ON deck_cards.deck_id = deck.deck_id INNER JOIN users ON deck.deck_id = users.deck_id WHERE users.username = $1'
  const cards = await db.any(query, [username]);
  console.log('friends cards: ', cards)
  const queryprice = 'SELECT SUM(cards.card_price) from cards INNER JOIN deck_cards ON cards.id = deck_cards.card_id INNER JOIN deck ON deck_cards.deck_id = deck.deck_id INNER JOIN users ON deck.deck_id = users.deck_id WHERE users.username = $1'
  const price = await db.any(queryprice, [username]);
  console.log('price: ', price)
  console.log('cards: ', cards)
  res.render('pages/friendscollection', { user: username, deck_id: deck_id, cards: cards, price: price, error: null, display: button })
});

app.post('/add-deck', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');  // Redirect if there's no user in session
  }
  const deck_id = req.body.deck_name
  const deck_query = 'INSERT INTO deck(deck_id) VALUES ($1)'
  await db.none(deck_query, [deck_id]);
  const user = req.session.user.username
  console.log('username: ', user)
  const query = 'UPDATE users SET deck_id = $1 WHERE username = $2'
  console.log('test1')
  await db.none(query, [deck_id, user]);
  console.log('test2')
  req.session.user.deck_id = deck_id
  console.log('User in session:', req.session.user);
  res.redirect('/profile')
})

app.get('/home', (req, res) => {
  if (!req.session.user) {
    // Redirect to login if somehow accessed directly without being logged in
    return res.redirect('/login');
  }
  res.render('pages/home', { user: req.session.user, error: null })
});

app.get('/search', async (req, res) => {
  const name = req.query.search;

  axios({
    url: 'https://api.pokemontcg.io/v2/cards',
    method: 'GET',
    params: {
      q: `name:${name}*`
    }
  })
    .then(results => {
      //console.log(results.data); // the results will be displayed on the terminal if the docker containers are running
      res.render('pages/search', { user: req.session.user, cards: results.data.data });
    })
    .catch(error => {
      // Handle errors
      res.status(400);
    });
});

app.post('/add-card', async (req, res) => {
  const card_id = req.body.card_id
  const card_name = req.body.card_name
  const card_image = req.body.card_image
  const card_rarity = req.body.card_rarity
  const card_price = req.body.card_price
  const card_set = req.body.card_set
  console.log('Add card', req.body)
  const query = `INSERT INTO cards (id, card_name, card_image, card_rarity, card_price, card_set) VALUES ($1, $2, $3, $4, $5, $6)`
  await db.none(query, [card_id, card_name, card_image, card_rarity, card_price, card_set])
  const query2 = 'INSERT INTO deck_cards (deck_id, card_id) VALUES ($1, $2)'
  await db.none(query2, [req.session.user.deck_id, card_id])
  res.redirect('/profile')
});

app.get('/forms', async (req, res) => {
  const formsQuery = 'SELECT * FROM community_forms';
  const community_forms = await db.any(formsQuery);
  req.session.forms = community_forms;
  console.log(community_forms); // sending to console to test
  res.render('pages/forms', { user: req.session.user, error: null, forms: community_forms || [] })
});

app.post('/forms/add', async (req, res) => {

});

app.post('/trade-card', async (req, res) => {
  const card_id = req.body.card_id
  const deck_id = req.body.deck_id
  console.log('Trade card: ', req.body)
  const query = 'INSERT INTO trade_cards (card_id, deck_id) VALUES ($1, $2)'
  db.none(query, [card_id, deck_id])
  res.redirect('/friends')
})

app.post('/cancel-trade', async (req, res) => {
  const truncate = 'TRUNCATE TABLE trade_cards'
  await db.none(truncate)
  res.redirect('/profile')
})

app.post('/friend-trade-card', async (req, res) => {
  console.log('Friend Trade card: ', req.body)
  const trade_card_id = req.body.card_id
  const deck_id = req.body.deck_id
  const query_card_id = 'SELECT card_id from trade_cards WHERE deck_id = $1'
  const user_card_id = await db.one(query_card_id, [req.session.user.deck_id])
  console.log('trade card id:', trade_card_id)
  console.log('user card id:', user_card_id.card_id)
  const card1 = 'UPDATE deck_cards SET card_id = $1 WHERE deck_id = $2 AND card_id = $3'
  await db.none(card1, [trade_card_id, req.session.user.deck_id, user_card_id.card_id])
  const card2 = 'UPDATE deck_cards SET card_id = $1 WHERE deck_id = $2 AND card_id = $3'
  await db.none(card2, [user_card_id.card_id, deck_id, trade_card_id])
  const truncate = 'TRUNCATE TABLE trade_cards'
  await db.none(truncate)
  res.redirect('/profile')
})

app.post('/remove-card', async (req, res) => {
  const card_id = req.body.card_id
  const deck_id = req.body.deck_id
  const query = 'DELETE FROM deck_cards where card_id = $1 AND deck_id = $2'
  await db.none(query, [card_id, deck_id])
  res.redirect('/profile')
})
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
