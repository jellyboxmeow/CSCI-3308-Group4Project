// ********************** Initialize server **********************************

const server = require('../index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************
// Example Positive Testcase :
// API: /add_user
// Input: {id: 5, name: 'John Doe', dob: '2020-02-20'}
// Expect: res.status == 200 and res.body.message == 'Success'
// Result: This test case should pass and return a status 200 along with a "Success" message.
// Explanation: The testcase will call the /add_user API with the following input
// and expects the API to return a status of 200 along with the "Success" message.

// describe('Testing Register API', () => {
//   it('positive : /register', done => {
//     chai
//       .request(server)
//       .post('/register')
//       .send({id: 5, username: 'John Doe', password: '20200220'})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.equals('Success');
//         done();
//       });
//   });
//   it('Negative : /register. Checking if username already exists', done => {
//     chai
//       .request(server)
//       .post('/register')
//       .send({id: 5, username: 'John Doe', password: '25000220'})
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body.message).to.equals('Username already exists.');
//         done();
//       });
//   });
// });
describe('Testing Register API', () => {
  
  it('positive : /register and should redirect to /login', done => {
    // Send a POST request with a valid username and password
    chai
      .request(server)
      .post('/register')
      .send({ username: 'John Doe', password: '20200220' })  // Example input
      .end((err, res) => {
        res.should.have.status(200); // Expecting a redirect status code
        res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/);
        done();  // Indicate the end of this test
      });
  });

  it('Negative : /register. Checking if username already exists', done => {
    // First, register the username
    chai
      .request(server)
      .post('/register')
      .send({ username: 'John Doe', password: '20200220' })
      .end((err, res) => {
        // Now try registering the same username again to check for uniqueness
        chai
          .request(server)
          .post('/register')
          .send({ username: 'John Doe', password: '25000220' })  // Different password, same username
          .end((err, res) => {
            // res.should.have.status(400);  // Expect status 400 for a conflict
            res.should.redirectTo(/^.*127\.0\.0\.1.*\/register$/);
            done();
          });
      });
  });
});

describe('Testing Login API', () => {
  
  it('Positive : /login. If user is in database login successfully', done => {
    // Send a POST request with a valid username and password
    chai
      .request(server)
      .post('/login')
      .send({ username: 'John Doe', password: '20200220' })  // Example input
      .end((err, res) => {
        res.should.have.status(200); // Expecting a redirect status code
        res.should.redirectTo(/^.*127\.0\.0\.1.*\/friends$/);
        done();  // Indicate the end of this test
    });
  });
  it('Negative : /login. If user is not in database login redirect to register page', done => {
    // Send a POST request with a valid username and password
    chai
      .request(server)
      .post('/login')
      .send({ username: 'd', password: '200' })  // Example input
      .end((err, res) => {
        res.should.have.status(200); // Expecting a redirect status code
        res.should.redirectTo(/^.*127\.0\.0\.1.*\/register$/);
        done();  // Indicate the end of this test
    });
  });
});
  
// ********************************************************************************