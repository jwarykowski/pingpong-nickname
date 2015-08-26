[![Build Status](https://travis-ci.org/jonathanchrisp/pingpong-nickname.svg)](https://travis-ci.org/jonathanchrisp/pingpong-nickname)
[![npm version](https://badge.fury.io/js/pingpong-nickname.svg)](http://badge.fury.io/js/pingpong-nickname)

# pingpong-nickname
A npm package for an awesome ping pong nickname

## Getting Started

Create a new instance of PingPongNickname passing the configuration options and optional default request options:

var PingPongNickname = require('pingpong-nickname');

var pingPongNickname = new PingPongNickname({
    host: 'yourhost.com',
    port: 3000,
    protocol: 'http'
}, {
    auth: {
        user: 'user',
        pass: 'pass',
        sendImmediately: true
    }
});

The client must be created with a host or an error will be thrown.

## Using the client
Call `pingPongNickname.nickname(callback)` with the following parameters:

```
@param {function} callback A callback function. Will be sent the following params:
    @param {string} error An error
    @param {object} response The server response
    @param {object} body The body of the response
```

An example:

```
// Get a new nickname
pingPongNickname.nickname(function(error, response, body) {
    if (error) {
        console.log(error);
    } else {
        console.log(body);
    }
});
```

## Testing
### Unit tests
To run all unit tests within the package run:
```
npm test
```

### Code Style / Lint Checks
To run jshint and jscs checks within the package run:
```
npm run lint
```

