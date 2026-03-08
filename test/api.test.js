
const request = require('supertest');
const bitcoinApi = require('../lib/api');

describe('bitcoin-node-api method normalization', () => {

  let app;
  beforeEach(() => {
    // Set up the API and override accesslist
    bitcoinApi.setAccess('only', ['getblock']);
    // Use setWalletDetails to inject the mock client
    bitcoinApi.setWalletDetails({ command: (cmd, cb) => cb(null, [{ result: 'ok' }]) });
    app = bitcoinApi.app;
  });

  it('should allow whitelisted method with parameter', async () => {
    const res = await request(app).get('/getblock/123');
    if (res.statusCode !== 200) {
      console.log('Response status:', res.statusCode);
      console.log('Response body:', res.body);
      console.log('Response text:', res.text);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result', 'ok');
  });

  it('should block non-whitelisted method with 403', async () => {
    const res = await request(app).get('/notallowed/123');
    expect(res.statusCode).toBe(403);
    expect(res.text).toMatch(/restricted/);
  });
});
