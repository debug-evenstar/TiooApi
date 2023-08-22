const { TotalLog } = require("../database/connection");

class Logger {

        static async monitor(req, res, next) {

        const start = Date.now();

        // console.log(`ON REEQUEST [${new Date().toISOString()}] ${req.method} ${req.url}`);

        res.on('finish', async () => {

            const duration = Date.now() - start; 
            if ( req.body.password) {
                delete  req.body.password;
            }
            const statusMessage = res.statusMessage;
            const reqBody =  JSON.stringify(req.body);;
            const responseBody = res._treblleResponsebody;
            const params = JSON.stringify(req.params);
            const query = JSON.stringify(req.query);;
            const method = req.method;
            const url = req.url;
            const originalUrl = req.url;
            const payload = { statusMessage, reqBody, responseBody, params, query, method, url, body: reqBody, originalUrl, statuscode: JSON.stringify(res.statusCode)}

            if(url !== '/logging'){
               try{
                await TotalLog.create(payload);
               }catch(err){
                //
               }
            }           

            // console.log(`ON RESPONSE [${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
        });

        res.on('error', (err) => {
            // console.error(`ON ERROR [${new Date().toISOString()}] ${req.method} ${req.url} - Error: ${err.message}`);
        });

        next();
    };

}

module.exports = Logger;