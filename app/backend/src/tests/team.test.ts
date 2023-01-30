import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import { Response } from 'superagent';

// @ts-ignore
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

import { app } from '../app';
import Team from '../database/models/Team.model';
import { teamsMock } from './mocks/team.mock';

describe('Testing the GET route for Teams', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('Should successfully access the route', async () => {
    sinon.stub(Team, 'findAll').resolves(teamsMock as Team[])

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams')

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(teamsMock);
  })
})

describe('Testing the GET route for Teams/:id', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
      sinon.restore()
    })
  
  it('Should successfully access the route', async () => {
    sinon.stub(Team, 'findByPk').resolves(teamsMock[1] as Team)

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/2');

    expect(chaiHttpResponse.status).to.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(teamsMock[1]);
  })
  
  it('Should fail the access at the route', async () => {
    sinon.stub(Team, 'findByPk').resolves();

    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/555');

    expect(chaiHttpResponse.status).to.equal(400);
    expect(chaiHttpResponse.body.message).to.equal('Team not found');
  })
})