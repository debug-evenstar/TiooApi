const globalRoute = require('./api.routes');


class Routes {

        constructor(app) {
            this.app = app;

               const bodyParser = require("body-parser");
               const express = require("express");
               app.use(bodyParser.urlencoded({ extended: false }));
               app.use(bodyParser.json());
               app.use(express.static('public'));
        }

        register(){
            let instance = this
            instance.app.use('/api/', globalRoute);
        }
}

module.exports = (args) => {return new Routes(args)};