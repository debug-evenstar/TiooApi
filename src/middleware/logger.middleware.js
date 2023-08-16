const { TotalLog } = require("../database/connection");

class Logger {

        static async monitor(req, res, next) {

        const start = Date.now();

        console.log(`ON REEQUEST [${new Date().toISOString()}] ${req.method} ${req.url}`);

        res.on('finish', async () => {
            const duration = Date.now() - start;

            const statusMessage = res.statusMessage;
            const reqBody = req.body;
            if (reqBody.password) {
                delete reqBody.password;
            }
            const responseBody = res._treblleResponsebody;
            const params = res.params;
            const query = res.query;
            const method = res.method;
            const url = res.url;
            const body = res.body;
            const originalUrl = res.url;

            await TotalLog.create(payload);
            

            console.log(`ON RESPONSE [${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
        });

        res.on('error', (err) => {
            console.error(`ON ERROR [${new Date().toISOString()}] ${req.method} ${req.url} - Error: ${err.message}`);
        });

        next();
    };

}

module.exports = Logger;