const server = require('./src/server');

const path = require('path');
global.appRoot = path.resolve(__dirname);

server.boot();