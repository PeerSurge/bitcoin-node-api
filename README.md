
# bitcoin-node-api

![npm](https://img.shields.io/npm/v/bitcoin-node-api)
![npm downloads](https://img.shields.io/npm/dm/bitcoin-node-api)
![GitHub](https://img.shields.io/github/license/uaktags/Bitcoin-Node-Api)

Bitcoin-Node-Api is an Express middleware plugin that exposes a URL structure for interfacing with a bitcoind Bitcoin wallet.

> **Note:** This middleware is experimental. Some JSON-RPC methods with complex parameters are not yet supported:
> - addmultisigaddress
> - createmultisig
> - createrawtransaction
> - getaddednodeinfo
> - lockunspent
> - sendmany
> - signrawtransaction
> - submitblock

These methods will be added in the future. Please report any issues with other methods.

---

## Table of Contents

- [Features](#features)
- [Install](#install)
- [How to use](#how-to-use)
- [API Examples](#api-examples)
- [Access Control](#access-control)
- [Projects Using bitcoin-node-api](#projects-using-bitcoin-node-api)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Simple Express middleware for Bitcoin Core JSON-RPC
- Easy URL-based access to wallet methods
- Access control profiles (default-safe, read-only, custom)
- Supports modern Node.js and Express

---


## Install

```sh
npm install bitcoin-node-api
```


## How to use

### Node.js Example

```js
const bitcoinapi = require('bitcoin-node-api');
const express = require('express');
const app = express();

// Username and password relate to those set in the bitcoin.conf file
const wallet = {
  host: 'localhost',
  port: 8332,
  user: 'username',
  pass: 'password',
};

bitcoinapi.setWalletDetails(wallet);
bitcoinapi.setAccess('default-safe'); // Access control
app.use('/bitcoin/api', bitcoinapi.app); // Bind the middleware to any chosen url

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### Example .env (recommended)

```
BITCOIN_HOST=localhost
BITCOIN_PORT=8332
BITCOIN_USER=username
BITCOIN_PASS=password
```

> ⚠️ **Security tip:** Never commit real credentials to version control. Use environment variables or a config file excluded by .gitignore.


---

## API Examples

Just add the method name after the bound URL:

```
http://localhost:3000/bitcoin/api/getinfo
```

Returns data as from the JSON-RPC API:


```json
{
  "version": 80300,
  "protocolversion": 70001,
  "walletversion": 60000,
  "balance": 4.3222,
  "blocks": 245645,
  "timeoffset": -2,
  "connections": 8,
  "proxy": "",
  "difficulty": 21335329.113983,
  "testnet": false,
  "keypoololdest": 1368414896,
  "keypoolsize": 101,
  "paytxfee": 0.0001,
  "unlocked_until": 0,
  "errors": ""
}
```


Parameters are sent via a query string:

```
http://localhost:3000/bitcoin/api/gettransaction?txid=d6c7e35ff9c9623208c22ee37a118ad523ae6c2d137d10053739cb03dbac62e0
```

```json
{
  "amount": 0.002,
  "confirmations": 1321,
  "blockhash": "000000000000009d0a2bb76c81dd185d1f6c28256037baef7b3345b7a7e958c7",
  "blockindex": 150,
  "blocktime": 1372728756,
  "txid": "d6c7e35ff9c9623208c22ee37a118ad523ae6c2d137d10053739cb03dbac62e0",
  "time": 1372728436,
  "timereceived": 1372728436,
  "details": [
    {
      "account": "localtest",
      "address": "1Htev475XRVYfenku7ZWXGPSun15ESynCq",
      "category": "receive",
      "amount": 0.002
    }
  ]
}
```


Consult the [Bitcoin Core API call list](https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_Calls_list) for parameter information.



---

## Access Control

### .setWalletPassphrase(passphrase)

If you have encrypted your wallet.dat, set the passphrase before attaching the middleware:

```js
bitcoinapi.setWalletDetails(wallet);
bitcoinapi.setWalletPassphrase(passphrase);
app.use('/bitcoin/api', bitcoinapi.app);
```

### .setAccess(type, accesslist)

The `.setAccess` method controls access to the URLs. By default, all commands are accessible. Restrict access in two ways:

#### 'only'

Expose only the methods listed:

```js
// Only allow the getinfo method
bitcoinapi.setAccess('only', ['getinfo']);
```

#### 'restrict'

Prevent access to specific methods:

```js
bitcoinapi.setAccess('restrict', ['dumpprivkey', 'sendmany']);
```

### Access Profiles

Predefined access profiles make setup easy:

#### 'default-safe'

Prevents 'dumpprivkey', 'walletpassphrasechange', and 'stop' commands:

```js
bitcoinapi.setAccess('default-safe');
```

#### 'read-only'

Only exposes methods that show information (no send/alter wallet methods):

```js
bitcoinapi.setAccess('read-only');
```


---

## Projects Using bitcoin-node-api

If you use bitcoin-node-api in your project, submit a pull request to add your link here or email niel@delarouviere.com.


---

## Changelog

See [changelog.md](changelog.md) for release history.

---

## Contributing

Contributions are welcome! Please open issues or pull requests. For major changes, open an issue first to discuss what you would like to change.

---

## License


MIT © 2013 Niel de la Rouviere
