import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';

// @ts-ignore
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

import { Response } from 'superagent';

import { app } from '../app';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';

import { matchCreated, matchesMock, matchNew, matchEqualTeams } from './mocks/match.mock';
import { jwtEx } from './mocks/jwt.mock'
import { mockedToken } from './mocks/user.mock';
import { teamsMock } from './mocks/team.mock';


describe('Testing the GET route for Matches', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('Should successfully access the route', async () => {
    sinon.stub(Match, 'findAll').resolves(matchesMock as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
  })
});

describe('Testing the GET route for Matches with /matches?inProgress=', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('Filter with the matches in progress with the false status', async () => {
    const filterFalse = matchesMock.filter((m) => m.inProgress === false);
    sinon.stub(Match, 'findAll').resolves(filterFalse as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(filterFalse);
  })

  it('Filter with the matches in progress with the true status', async () => {
    const filterTrue = matchesMock.filter((m) => m.inProgress === true);
    sinon.stub(Match, 'findAll').resolves(filterTrue as unknown as Match[]);

    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(filterTrue);
  })
});

describe('Testing the GET route for Matches with :id/finish', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('Should successfully access the route', async () => {
    sinon.stub(Match, 'update').resolves([2]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/2/finish');

      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body.message).to.equal('Finished');

    
  })

  it('Should fail the access at the route', async () => {
    sinon.stub(Match, 'update').resolves([0]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/444/finish');

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('Match does not exist');
  })
});

describe('Testing the POST route for Matches', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })

  it('Should fail the access at the route, without token', async () => {
    sinon.stub(jwt, 'verify').resolves(jwtEx);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(matchEqualTeams);

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  })

  it('Should fail the access at the route, with valid token', async () => {
    sinon.stub(jwt, 'verify').throws(new Error('error'));

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(matchEqualTeams).set('Authorization', 'mockedToken');

    expect(chaiHttpResponse.status).to.equal(401);
    expect(chaiHttpResponse.body.message).to.equal('Token must be a valid token');
  })
  
  it('Should fail the access at the route, with two equal teams', async () => {
    sinon.stub(jwt, 'verify').resolves(jwtEx);
    
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(matchEqualTeams).set('Authorization', mockedToken);

    expect(chaiHttpResponse.status).to.equal(422);
    expect(chaiHttpResponse.body.message).to.equal('It is not possible to create a match with two equal teams');
  })

  it('Should fail the access at the route, when home Team doesnt exists', async () => {
    sinon.stub(Match, 'findByPk')
      .onFirstCall().resolves()
      .onSecondCall().resolves(teamsMock[1] as Team);
    sinon.stub(jwt, 'verify').resolves(jwtEx);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(matchNew).set('Authorization', mockedToken);

    expect(chaiHttpResponse.status).to.equal(404);
    expect(chaiHttpResponse.body.message).to.equal('There is no team with such id!');
  })

  it('Should fail the access at the route, when away Team doesnt exists', async () => {
    sinon.stub(Match, 'findByPk')
      .onFirstCall().resolves(teamsMock[0] as Team)
      .onSecondCall().resolves();
    sinon.stub(jwt, 'verify').resolves(jwtEx);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(matchNew).set('Authorization', mockedToken);

    expect(chaiHttpResponse.status).to.equal(404);
    expect(chaiHttpResponse.body.message).to.equal('There is no team with such id!');
  })

  it('Should successfully access the route', async () => {
    sinon.stub(Match, 'findByPk')
      .onFirstCall().resolves(teamsMock[0] as Team)
      .onSecondCall().resolves(teamsMock[1] as Team);
    sinon.stub(jwt, 'verify').resolves(jwtEx);
    sinon.stub(Match, 'create').resolves(matchCreated as Match);

    chaiHttpResponse = await chai
      .request(app)
      .post('/matches').send(matchNew).set('Authorization', mockedToken);
    
    expect(chaiHttpResponse.status).to.equal(201);
    expect(chaiHttpResponse.body).to.deep.equal(matchCreated);
  })
});

describe('Testing the GET route for Matches with :id', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
    sinon.restore()
  });
  
  it('Should fail the access at the route', async () => {
    sinon.stub(jwt, 'verify').resolves(jwtEx);
    sinon.stub(Match, 'update').resolves([0]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/555').send({
        homeTeamGoals: 3,
        awayTeamGoals: 1
      }).set('Authorization', mockedToken);

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('Match does not exist');
  });

  it('Should successfully access the route', async () => {
    sinon.stub(jwt, 'verify').resolves(jwtEx);
    sinon.stub(Match, 'update').resolves([1]);

    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/555').send({
        homeTeamGoals: 3,
        awayTeamGoals: 1
      }).set('Authorization', mockedToken);

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal({
      homeTeamGoals: 3,
      awayTeamGoals: 1,
      decoded: {},
    });
  });
});
