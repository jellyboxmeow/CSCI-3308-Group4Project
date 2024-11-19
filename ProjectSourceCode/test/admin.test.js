const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Update with your main server file path
const { expect } = chai;

chai.use(chaiHttp);

describe('Admin Routes', () => {
    let agent = chai.request.agent(app);

    before(async () => {
        // Login as admin before running tests
        await agent.post('/login').send({ username: 'admin', password: 'adminpass' });
    });

    it('should load admin home page', (done) => {
        agent.get('/admin/home')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('Welcome, Admin!');
                done();
            });
    });

    it('should add a new achievement', (done) => {
        agent.post('/admin/achievements')
            .send({ title: 'Test Achievement', description: 'Test Description' })
            .end((err, res) => {
                expect(res).to.redirectTo('/admin/achievements');
                done();
            });
    });

    it('should fail to access admin route without login', (done) => {
        chai.request(app).get('/admin/home')
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
    });
});
describe('Admin Guide Routes', () => {
    it('should load admin guides page', (done) => {
        agent.get('/admin/guides')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include('Manage Guides');
                done();
            });
    });

    it('should add a new guide', (done) => {
        agent.post('/admin/guides')
            .send({ title: 'Test Guide', content: 'This is a test guide.' })
            .end((err, res) => {
                expect(res).to.redirectTo('/admin/guides');
                done();
            });
    });

    it('should edit an existing guide', (done) => {
        agent.post('/admin/guides/edit/1') // Replace with a valid guide ID
            .send({ title: 'Updated Guide', content: 'Updated content.' })
            .end((err, res) => {
                expect(res).to.redirectTo('/admin/guides');
                done();
            });
    });

    it('should delete a guide', (done) => {
        agent.post('/admin/guides/delete/1') // Replace with a valid guide ID
            .end((err, res) => {
                expect(res).to.redirectTo('/admin/guides');
                done();
            });
    });
});
