// test.js
import { expect } from 'chai';
import request from 'supertest';
import app from './../bin/server.js'; // Replace with the correct path

describe('Test server endpoint', () => {
  it('responds with JSON message', async () => {
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({message: "OK! Health Check."});
  });
});

describe('Open AI response check unit test case for API', () => {
  
  // it('should fetch open AI data ', async () => {
  //   const res = await request(app).get('/api/sammple-url');
  //   expect(res.status).to.equal(200);
  //   // expect(res.body).to.deep.equal(sampleData);
   
  //   expect(res.body).to.have.property('code').to.be.a('number');
  //   expect(res.body).to.have.property('status').that.equals('success');
  //   expect(res.body).to.have.property('status').to.be.a('string');
    
  // });

});
