const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const { db } = require("../database/connection");
const PORT = process.env.PORT || 8080;
const IndexRoute = require('../routes/index');
const treblle = require('@treblle/express');
const UploadService = require('../services/upload.service');
const AutoMigrate = require("../migrations/automigrate");
const AuthorizationSeed = require("../seeders/seed.authorization");





class Server {

    static boot() {

        const corsOptions = {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            preflightContinue: false,
            optionsSuccessStatus: 200
        };

        app.use(cors(corsOptions));

        app.use(
            treblle({
                apiKey: process.env.TREBLLE_API_KEY,
                projectId: process.env.TREBLLE_PROJECT_ID,
            })
        );

        //=============== INITIALIZE DATABASE ================//
        //{force : true}
        db.sequelize.sync()
            .then(async () => {
                AutoMigrate.validateModelsIntegrity();
                // AuthorizationSeed.permission();
                console.log("Synced db.");
            })
            .catch((err) => {
                console.log("Failed to sync db: " + err.message);
            });

        //=============== REGISTERED ROUTE ================//

        IndexRoute(app).register();

        const server = app.listen(PORT, () => {
            console.log(`NIMO SERVER RUNNING @ http://127.0.0.1:${PORT}/api`);

        });

    }

}

module.exports = Server;