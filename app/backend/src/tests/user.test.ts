import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Response } from 'superagent';

// @ts-ignore
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

import { app } from '../app';
import * as auth from '../authentication/jwtFuncs';
import User from '../database/models/User.model';
import { jwtMock, mockedToken, successCreatedUser } from './mocks/user.mock';

const loginInfo = {
  email: 'mock@mock.com',
  password: 'secret_admin',
}

describe('Testing the POST route for Login', () => {
  let chaiHttpResponse: Response;
  afterEach(()=>{
      (User.findOne as sinon.SinonStub).restore();
      sinon.restore()
    })

  it('Checks if its possible to login without password', async () => {
    sinon.stub(User, 'findOne').resolves(successCreatedUser as User)
  
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ email: loginInfo.email });
      
    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('All fields must be filled');
  });

  it('Checks if its possible to login without email', async () => {
    sinon.stub(User, 'findOne').resolves(successCreatedUser as User)
  
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ password: loginInfo.password });
      
    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('All fields must be filled');
  });

  it('Checks if its possible to login with invalid password', async () => {
    sinon.stub(User, 'findOne').resolves(successCreatedUser as User);
    sinon.stub(bcrypt, 'compareSync').returns(false);
  
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send({ ...loginInfo, password: 'errado'});
      
    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Incorrect email or password');
  });

  it('Checks if its possible to login with invalid email', async () => {
    sinon.stub(User, 'findOne').resolves();
  
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(loginInfo);
      
    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Incorrect email or password');
  });

  it('Check the success case', async () => {
    sinon.stub(User, 'findOne').resolves(successCreatedUser as User);
    sinon.stub(bcrypt, 'compareSync').returns(true);
    sinon.stub(auth, 'generateToken').returns(mockedToken)
  
    chaiHttpResponse = await chai
      .request(app)
      .post('/login')
      .send(loginInfo);
      
    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body.token).to.equal(mockedToken);
  });
});

describe('Testing the GET route for login/validate', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      (User.findOne as sinon.SinonStub).restore();
      sinon.restore()
    })

  it('Checks if its possible to login without token', async () => {
    sinon.stub(User, 'findOne').resolves(successCreatedUser as User);
  
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate').set('Authorization', '');
      
    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  });

  it('Checks if its possible to login with invalid token', async () => {
    sinon.stub(User, 'findOne').resolves(successCreatedUser as User);
    sinon.stub(auth, 'verifyToken').returns('jwtMock');
  
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate').set('Authorization', 'wrongToken');
      
    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  });

  it('Check the success case', async () => {
    sinon.stub(User, 'findOne').resolves();
    sinon.stub(jwt, 'verify').returns(jwtMock as any);
  
    chaiHttpResponse = await chai
      .request(app)
      .get('/login/validate').set('Authorization', mockedToken);
      
    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body.role).to.equal(jwtMock.data.role);
  });
});
