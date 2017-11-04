# Node Twitter

[![Build Status](https://travis-ci.org/vinitkumar/node-twitter.svg?branch=master)](https://travis-ci.org/vinitkumar/node-twitter)

Node twitter is an effort to rewrite some of Twitter's functionality using modern
javascript based toolchain. It was mostly an effort to learn Node.js and trying to reverse
engineer some of twitter's feature.

<img src="https://cldup.com/smoNHY-9mI.png">
<img src="https://cldup.com/oEa3EIGhyJ.png">

## Prerequisites

You are required to have Node.js and MongoDB installed if you'd like to run the app locally.

- [Node.js](http://nodejs.org)
- [Mongodb](http://docs.mongodb.org/manual/installation/)

Install sass and grunt too to compile the CSS files

```
sudo npm install -g grunt-cli
sudo npm install -g sass

```

The configuration is in `config/config.js`. Please create your own
github application [Github Developer Settings](https://github.com/settings/applications) and replace the token and keys.

```js
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');
module.exports = {
  production: {
    db: '',
    root: rootPath,
    app: {
      name: 'Node Twitter'
    },
    github: {
      clientID: '',
      clientSecret: '',
      callbackURL: ''
    }
  }
};
```

## Usage

```sh
# First install all the project dependencies.
# run mongodb server
~/ mongod
~/node-twitter/ npm install
# Now run the app
~/node-twitter/ npm start

> node-twitter@1.1.0 start ~/node-twitter
> node server.js

Express app started on port 3000
```

## Authors

[![Vinit Kumar](https://avatars0.githubusercontent.com/u/537678?v=3&s=144)](https://vinitkumar.me)
[![Robert Cooper](https://avatars0.githubusercontent.com/u/16786990?v=3&s=144)](http://www.robertcooper.me/)

[Say Thanks](https://saythanks.io/to/vinitkumar)

## Support
If you enjoy node-twitter, you can support the development here. https://gratipay.com/vinitkme/. :)

## License
[GPL-3.0](https://github.com/vinitkumar/node-twitter/blob/master/License)

## Sponsors
<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/uyhQ2YHmpDTZbNRraFXJEvTa/vinitkumar/node-twitter'><img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/uyhQ2YHmpDTZbNRraFXJEvTa/vinitkumar/node-twitter.svg' /></a>

## Important

Twitter is a registered trademark of Twitter Inc. This project is just for learning purposes and should be treated as such.
