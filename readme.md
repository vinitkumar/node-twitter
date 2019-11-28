# Node Twitter

[![Build Status](https://travis-ci.org/vinitkumar/node-twitter.svg?branch=master)](https://travis-ci.org/vinitkumar/node-twitter)
<img src="https://opencollective.com/nodetwitter/tiers/backer/badge.svg?label=backer&color=brightgreen" />


Node twitter is an effort to rewrite some of Twitter's functionality using modern
javascript based toolchain. It was mostly an effort to learn Node.js and trying to reverse
engineer some of twitter's feature.

It has support for tweeting, commenting and following with analytics

You can support the development here by becoming a backer: https://opencollective.com/nodetwitter/

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

The configuration is in `config/config.js`. Please create your own `.env` file. You can find an example of `.env` file in `.env.example`.

Create a [github application](https://github.com/settings/apps) and copy cliend id and secret to .env file:  

```
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
```
## Usage via Docker


The fastest way to get this running is with docker. Docker bootstrap all dependencies and
you can just run these couple of commands to get it up and running.

```
# first build the container
docker-compose --log-level DEBUG build

# then run the server and mongodb like this:

docker-compose up
```
Now, open the website on http://localhost:3000 and it should just work.

Before building Docker container change DB link to: `mongodb://mongodb/ntwitter` in `.env` file.


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

# Contribute

## Introduction

First, thank you for considering contributing to Node Twitter


! It's people like you that make the open source community such a great community! 😊

We welcome any type of contribution, not only code. You can help with
- **QA**: file bug reports, the more details you can give the better (e.g. screenshots with the console open)
- **Marketing**: writing blog posts, howto's, printing stickers, ...
- **Community**: presenting the project at meetups, organizing a dedicated meetup for the local community, ...
- **Code**: take a look at the [open issues](https://github.com/vinitkumar/node-twitter/issues). Even if you can't write code, commenting on them, showing that you care about a given issue matters. It helps us triage them.
- **Money**: we welcome financial contributions in full transparency on our [open collective](https://opencollective.com/nodetwitter/).

## Your First Contribution

Working on your first Pull Request? You can learn how from this *free* series, [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

## Submitting code

Any code change should be submitted as a pull request. The description should explain what the code does and give steps to execute it. The pull request should also contain tests.

## Code review process

The bigger the pull request, the longer it will take to review and merge. Try to break down large pull requests in smaller chunks that are easier to review and merge.
It is also always helpful to have some context for your pull request. What was the purpose? Why does it matter to you?

## Financial contributions

We also welcome financial contributions in full transparency on our [open collective](https://opencollective.com/nodetwitter/).
Anyone can file an expense. If the expense makes sense for the development of the community, it will be "merged" in the ledger of our open collective by the core contributors and the person who filed the expense will be reimbursed.

## Questions

If you have any questions, create an [issue](issue) (protip: do a quick search first to see if someone else didn't ask the same question before!).
You can also reach us at mail@vinitkumar.me

## Credits

### Contributors

Thank you to all the people who have already contributed to node-twitter!

[![0](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/0)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/0)
[![1](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/1)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/1)
[![2](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/2)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/2)
[![3](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/3)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/3)
[![4](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/4)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/4)
[![5](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/5)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/5)
[![6](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/6)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/6)
[![7](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/images/7)](https://sourcerer.io/fame/vinitkumar/vinitkumar/node-twitter/links/7)


### Backers

Thank you to all our backers! [[Become a backer](https://opencollective.com/nodetwitter/#backer)]

<a href="https://opencollective.com/nodetwitter#backers" target="_blank"><img src="https://opencollective.com/nodetwitter/backers.svg?width=890"></a>


### Sponsors

Thank you to all our sponsors! (please ask your company to also support this open source project by [becoming a sponsor](https://opencollective.com/nodetwitter/#sponsor))

<a href="https://opencollective.com/nodetwitter/sponsor/0/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/1/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/2/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/3/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/4/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/5/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/6/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/7/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/8/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/nodetwitter/sponsor/9/website" target="_blank"><img src="https://opencollective.com/nodetwitter/sponsor/9/avatar.svg"></a>

<!-- This `CONTRIBUTING.md` is based on @nayafia's template https://github.com/nayafia/contributing-template -->
## License
[Apache License 2.0](https://github.com/vinitkumar/node-twitter/blob/master/License)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fvinitkumar%2Fnode-twitter.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fvinitkumar%2Fnode-twitter?ref=badge_large)

## Important

Twitter is a registered trademark of Twitter Inc. This project is just for learning purposes and should be treated as such.
