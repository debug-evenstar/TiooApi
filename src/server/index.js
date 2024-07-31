const express = require("express");
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto");
const app = express();
const { db } = require("../database/connection");
const PORT = process.env.PORT || 8080;
const IndexRoute = require("../routes/index");
const treblle = require("@treblle/express");
const UploadService = require("../services/upload.service");
const AutoMigrate = require("../migrations/automigrate");
const AuthorizationSeed = require("../seeders/seed.authorization");
const Logger = require("../middleware/logger.middleware");
const path = require("path");
const SequelizeCliHelper = require("../database/connection/cli");

class Server {
    static boot() {
        const corsOptions = {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
            preflightContinue: false,
            optionsSuccessStatus: 200,
        };

        app.use(cors(corsOptions));

        app.use(
            treblle({
                apiKey: process.env.TREBLLE_API_KEY,
                projectId: process.env.TREBLLE_PROJECT_ID,
            })
        );

        // Create Sequelize CLI Config
        SequelizeCliHelper.createDBConfig();

        //=============== INITIALIZE DATABASE ================//
        //{force : true}
        // db.sequelize
        //     .sync()
        //     .then(async () => {
        //         // AutoMigrate.validateModelsIntegrity();
        //         // AuthorizationSeed.permission();
        //         console.log("Synced db.");
        //     })
        //     .catch((err) => {
        //         console.log("Failed to sync db: " + err.message);
        //     });

        app.use(express.static(path.join(__dirname, "../../public")));

        app.use(Logger.monitor);

        //=============== REGISTERED ROUTE ================//

        IndexRoute(app).register();
        const jwt = require("jsonwebtoken");
        const server = app.listen(PORT, "0.0.0.0", () => {
            //  console.log([randomPrivateKey, randomPublicKey, token]);
            console.log(`NIMO SERVER RUNNING @ http://127.0.0.1:${PORT}/api`);
        });
    }
}

module.exports = Server;
