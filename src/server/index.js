const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const { db } = require("../model/database/index");
const PORT = process.env.PORT || 8080;
const IndexRoute = require('../routes/index');

class Server {

    static boot() {

        const corsOptions = {
            origin: "http://localhost:8081",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            preflightContinue: false,
            optionsSuccessStatus: 200
        };

        app.use(cors(corsOptions));

        //=============== INITIALIZE DATABASE ================//

        db.sequelize.sync()
            .then(() => {
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