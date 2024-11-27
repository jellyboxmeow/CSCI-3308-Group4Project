// // ********************** Initialize server **********************************

// const server = require('../index'); //TODO: Make sure the path to your index.js is correctly added

// // ********************** Import Libraries ***********************************

// const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
// const chaiHttp = require('chai-http');
// chai.should();
// chai.use(chaiHttp);
// const { assert, expect } = chai;

// //For putting the db in
// // const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
// // const dbConfig = {
// //   host: 'db', // the database server
// //   port: 5432, // the database port
// //   database: process.env.POSTGRES_DB, // the database name
// //   user: process.env.POSTGRES_USER, // the user account to connect with
// //   password: process.env.POSTGRES_PASSWORD, // the password of the user account
// // };
// // const db = pgp(dbConfig);
// // const bcrypt = require('bcryptjs'); //  To hash passwords

// // ********************** DEFAULT WELCOME TESTCASE ****************************

// describe('Server!', () => {
//   // Sample test case given to test / endpoint.
//   it('Returns the default welcome message', done => {
//     chai
//       .request(server)
//       .get('/welcome')
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.status).to.equals('success');
//         assert.strictEqual(res.body.message, 'Welcome!');
//         done();
//       });
//   });
// });

// // *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// describe('Testing Register API', () => {

//   it('positive : /register and should redirect to /login', done => {

//     // Send a POST request with a valid username and password
//     chai
//       .request(server)
//       .post('/register')
//       .send({ username: 'test2', password: 'test2' })  // Example input
//       .end((err, res) => {
//         res.should.have.status(200); // Expecting a success status code and then a redirect
//         res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/);
//         done();  // Indicate the end of this test
//       });
//   });

//   it('Negative : /register. Checking if username already exists', done => {
//     // First, register the username
//     chai
//       .request(server)
//       .post('/register')
//       .send({ username: 'John Doe', password: '20200220' })
//       .end((err, res) => {
//         // Now try registering the same username again to check for uniqueness
//         chai
//           .request(server)
//           .post('/register')
//           .send({ username: 'John Doe', password: '20200220' })  // Same username, password shouldn't matter here
//           .end((err, res) => {
//             // res.should.have.status(400);  // Expect status 400 for a conflict
//             res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/); //expect a redirect 
//             done();
//           });
//       });
//   });
// });

// describe('Testing Login API', () => {
//   it('Positive : /login. If user is in database login successfully', done => {
//     const userData = {
//       username: 'John Doe',
//       password: '20200220',
//     };

//     // Send a POST request with a valid username and password
//     chai
//       .request(server)
//       .post('/login')
//       .send(userData)  // Example input
//       .end((err, res) => {
//         res.should.have.status(200); // Expecting a success status code and then a redirect
//         res.should.redirectTo(/^.*127\.0\.0\.1.*\/home$/);
//         done();  // Indicate the end of this test
//       });
//   });
//   it('Negative : /login. If user is not in database login redirect to register page', done => {
//     // Send a POST request with a valid username and password
//     chai
//       .request(server)
//       .post('/login')
//       .send({ username: 'd', password: '200' })  // Example input
//       .end((err, res) => {
//         res.should.have.status(200); // Expecting a success status code and then a redirect
//         res.should.redirectTo(/^.*127\.0\.0\.1.*\/register$/);
//         done();  // Indicate the end of this test
//       });
//   });
// });

// describe('Friends Route API', () => {
//   let agent;
//   const userData = {
//     username: 'John Doe',
//     password: '20200220',
//   };

<<<<<<< HEAD
=======
//   before(async () => {
//     // Clear users table and create test user
//     await db.query('TRUNCATE TABLE users CASCADE');
//     // const hashedPassword = await bcryptjs.hash(testUser.password, 10);
//     await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
//       testUser.username,
//       testUser.password,
//     ]);
//   });
// });

// // *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// describe('Testing Register API', () => {

//   it('positive : /register and should redirect to /login', done => {

//     // Send a POST request with a valid username and password
//     chai
//       .request(server)
//       .post('/register')
//       .send({ username: 'test2', password: 'test2' })  // Example input
//       .end((err, res) => {
//         res.should.have.status(200); // Expecting a success status code and then a redirect
//         res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/);
//         done();  // Indicate the end of this test
//       });
//   });

//   it('Negative : /register. Checking if username already exists', done => {
//     // First, register the username
//     chai
//       .request(server)
//       .post('/register')
//       .send({ username: 'John Doe', password: '20200220' })
//       .end((err, res) => {
//         // Now try registering the same username again to check for uniqueness
//         chai
//           .request(server)
//           .post('/register')
//           .send({ username: 'John Doe', password: '20200220' })  // Same username, password shouldn't matter here
//           .end((err, res) => {
//             // res.should.have.status(400);  // Expect status 400 for a conflict
//             res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/); //expect a redirect 
//             done();
//           });
//       });
//   });
// });

// describe('Testing Login API', () => {
//   it('Positive : /login. If user is in database login successfully', done => {
//     const userData = {
//       username: 'John Doe',
//       password: '20200220',
//     };

//     // Send a POST request with a valid username and password
//     chai
//       .request(server)
//       .post('/login')
//       .send(userData)  // Example input
//       .end((err, res) => {
//         res.should.have.status(200); // Expecting a success status code and then a redirect
//         res.should.redirectTo(/^.*127\.0\.0\.1.*\/home$/);
//         done();  // Indicate the end of this test
//       });
//   });
//   it('Negative : /login. If user is not in database login redirect to register page', done => {
//     // Send a POST request with a valid username and password
//     chai
//       .request(server)
//       .post('/login')
//       .send({ username: 'd', password: '200' })  // Example input
//       .end((err, res) => {
//         res.should.have.status(200); // Expecting a success status code and then a redirect
//         res.should.redirectTo(/^.*127\.0\.0\.1.*\/register$/);
//         done();  // Indicate the end of this test
//       });
//   });
// });

// describe('Friends Route API', () => {
//   let agent;
//   const userData = {
//     username: 'John Doe',
//     password: '20200220',
//   };

>>>>>>> origin/main
//   beforeEach(() => {
//     // Create new agent for session handling
//     agent = chai.request.agent(server);
//   });

//   afterEach(() => {
//     // Clear cookie after each test
//     agent.close();
//   });

//   describe('GET /friends', () => {
//     it('should redirect to /login page when not logged in', done => {
//       chai
//         .request(server)
//         .get('/friends')
//         .end((err, res) => {
//           expect(res).to.have.status(200);
//           res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/);
//           done();
//         });
//     });
//     it('Positive: Logged in with no friends displays no friends', async () => {
//       await agent.post('/login').send(userData);
//       const res = await agent.get('/friends');
//       // console.log(res);

//       expect(res).to.have.status(200);
//       res.text.should.include('You currently have no friends<');
//     });
//     it('Positive: Logged in with friends displays friends', async () => {
//       await agent.post('/login').send({ username: 'test', password: 'test' });
//       const res = await agent.get('/friends');

//       expect(res).to.have.status(200);
//       res.text.should.not.include('You currently have no friends<');
//     });
//     it('Positive: Adding Friends successfully', async () => {
//       await agent.post('/login').send(userData); //John Doe's user data
//       let res = await agent.get('/friends');
//       const addFriendres = await agent.post('/add-friend').send({ users_id: 4, friend_username: 'test' });
//       // console.log(addFriendres);
//       expect(addFriendres).to.have.status(200);
//       await new Promise(resolve => setTimeout(resolve, 100)); //Simulates reloading the page
//       res = await agent.get('/friends');
//       // console.log(res);

//       expect(res).to.have.status(200);
//       res.text.should.include('test');
//     });
//     it('Negative: If already friends, do not add', async () => {
//       await agent.post('/login').send(userData); //John Doe's user data
//       await agent.get('/friends');
//       const addFriendres = await agent.post('/add-friend').send({ users_id: 4, friend_username: 'test' });
//       // console.log(addFriendres.body);
//       expect(addFriendres).to.have.status(400);
//       expect(addFriendres.body).to.have.property('success', false);
//       expect(addFriendres.body).to.have.property('message', 'You already added them');
//     });
//     it('Negative: If user does not exist, do not add', async () => {
//       await agent.post('/login').send(userData); //John Doe's user data
//       await agent.get('/friends');
//       const addFriendres = await agent.post('/add-friend').send({ users_id: 4, friend_username: 'cat' });
//       // console.log(addFriendres.body);
//       expect(addFriendres).to.have.status(400);
//       expect(addFriendres.body).to.have.property('success', false);
//       expect(addFriendres.body).to.have.property('message', 'Please enter a valid user');
//     });
//     it('Negative: If try to friend yourself, do not add yourself', async () => {
//       await agent.post('/login').send(userData); //John Doe's user data
//       await agent.get('/friends');
//       const addFriendres = await agent.post('/add-friend').send({ users_id: 4, friend_username: 'John Doe' });
//       // console.log(addFriendres.body);
//       expect(addFriendres).to.have.status(400);
//       expect(addFriendres.body).to.have.property('success', false);
//       expect(addFriendres.body).to.have.property('message', 'You can not be friends with yourself');
//     });
//   });
// });

// // describe('Profile Route Tests', () => {
// //   let agent;
// //   const testUser = {
// //     username: 'testuser',
// //     password: '$2a$10$hAuKXBiEGYk1lEdc8CCO1.5KeT3YV0yxOVX6qb6Dk2TUZrh1yPo12',
// //     //testpass123
// //   };

// //   before(async () => {
// //     // Clear users table and create test user
// //     await db.query('TRUNCATE TABLE users CASCADE');
// //     // const hashedPassword = await bcryptjs.hash(testUser.password, 10);
// //     await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
// //       testUser.username,
// //       testUser.password,
// //     ]);
// //   });

// //   beforeEach(() => {
// //     // Create new agent for session handling
// //     agent = chai.request.agent(server);
// //   });

// //   afterEach(() => {
// //     // Clear cookie after each test
// //     agent.close();
// //   });

// //   after(async () => {
// //     // Clean up database
// //     await db.query('TRUNCATE TABLE users CASCADE');
// //   });

// //   describe('GET /profile', () => {
// //     it('should redirect to /login page', done => {
// //       chai
// //         .request(server)
// //         .get('/profile')
// //         .end((err, res) => {
// //           expect(res).to.have.status(200);
// //           res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/);
// //           done();
// //         });
// //     });

// //     it('should return user profile when authenticated', async () => {
// //       // First login to get session
// //       await agent.post('/login').send(testUser);

// //       // Then access profile
// //       const res = await agent.get('/profile');
// //       console.log(res.body);

// //       expect(res).to.have.status(200);
// //       expect(res.body).to.be.an('object');
// //       // expect(res.session.user.username).to.have.property('username', testUser.username);
// //     });
// //   });
// // });
// // ********************************************************************************