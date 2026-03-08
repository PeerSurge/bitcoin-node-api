
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

  it('should allow whitelisted method with path parameter and forward it to RPC', async () => {
    let capturedCommand;
    bitcoinApi.setWalletDetails({
      command: (cmd, cb) => {
        capturedCommand = cmd;
        cb(null, [{ result: 'ok' }]);
      }
    });
    const res = await request(app).get('/getblock/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result', 'ok');
    expect(capturedCommand[0].method).toBe('getblock');
    expect(capturedCommand[0].parameters).toEqual([123]);
  });

  it('should block non-whitelisted method', async () => {
    const res = await request(app).get('/notallowed/123');
    expect(res.text).toMatch(/restricted/);
  });
});
