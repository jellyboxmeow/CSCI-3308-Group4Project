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

describe('Testing Register API', () => {

  it('positive : /register and should redirect to /login', done => {
    
    // Send a POST request with a valid username and password
    chai
      .request(server)
      .post('/register')
      .send({ username: 'John Doe', password: '20200220' })  // Example input
      .end((err, res) => {
        res.should.have.status(200); // Expecting a success status code and then a redirect
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
          .send({ username: 'John Doe', password: '20200220' })  // Same username, password shouldn't matter here
          .end((err, res) => {
            // res.should.have.status(400);  // Expect status 400 for a conflict
            res.should.redirectTo(/^.*127\.0\.0\.1.*\/register$/); //expect a redirect 
            done();
          });
      });
  });
});

describe('Testing Login API', () => {
  it('Positive : /login. If user is in database login successfully', done => {
    const userData = {
      username: 'John Doe',
      password: '20200220',
    };

    // Send a POST request with a valid username and password
    chai
    .request(server)
    .post('/login')
    .send(userData)  // Example input
    .end((err, res) => {
      res.should.have.status(200); // Expecting a success status code and then a redirect
      res.should.redirectTo(/^.*127\.0\.0\.1.*\/home$/);
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
        res.should.have.status(200); // Expecting a success status code and then a redirect
        res.should.redirectTo(/^.*127\.0\.0\.1.*\/register$/);
        done();  // Indicate the end of this test
    });
  });
});
// ********************************************************************************