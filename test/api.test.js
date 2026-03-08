
const request = require('supertest');
const bitcoinApi = require('../lib/api');

describe('bitcoin-node-api method normalization', () => {

  let app;
  let lastCommand;
  beforeEach(() => {
    // Set up the API and override accesslist
    bitcoinApi.setAccess('only', ['getblock']);
    // Use setWalletDetails to inject the mock client that captures the command
    bitcoinApi.setWalletDetails({ command: (cmd, cb) => { lastCommand = cmd; cb(null, [{ result: 'ok' }]); } });
    app = bitcoinApi.app;
    lastCommand = null;
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

  it('should forward path parameter as positional RPC parameter', async () => {
    const res = await request(app).get('/getblock/123');
    expect(res.statusCode).toBe(200);
    expect(lastCommand).not.toBeNull();
    expect(lastCommand[0].method).toBe('getblock');
    expect(lastCommand[0].parameters).toContain(123);
  });

  it('should forward both path and query parameters in order', async () => {
    const res = await request(app).get('/getblock/123?verbose=1');
    expect(res.statusCode).toBe(200);
    expect(lastCommand[0].method).toBe('getblock');
    expect(lastCommand[0].parameters[0]).toBe(123);
    expect(lastCommand[0].parameters[1]).toBe(1);
  });

  it('should block non-whitelisted method', async () => {
    const res = await request(app).get('/notallowed/123');
    expect(res.text).toMatch(/restricted/);
  });
});
