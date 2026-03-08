
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
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result', 'ok');
  });

  it('should block non-whitelisted method', async () => {
    const res = await request(app).get('/notallowed/123');
    expect(res.text).toMatch(/restricted/);
  });
});
