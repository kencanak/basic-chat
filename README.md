# chat-app

1. This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.6.0.

2. This is just another mediocre chat app, building this just for learning Socket.io and getting familiar with AngularJS even more.

# Things to do

1. Proper unread message notification

2. Block user

3. Contact request approval

4. Group chat

5. Broadcast typing activity

6. Send file?

7. Update avatar

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## UI Styling

1. Using Materialize (http://materializecss.com/), for most of grid/css Styling

Note: Need to change it to use https://www.npmjs.com/package/angular2-materialize, currently initialising Materialize component is done by using JQuery (bad one, I know)

## Test account

1. admin/admin
2. testuser/test
