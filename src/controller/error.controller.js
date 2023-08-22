const { Error } = require("sequelize");
const { ErrorLog, TotalLog } = require("../database/connection");
const ResponseStatus = require("../config/message.config");
class LoggingController {

    static async fetchErrors(req, res) {
        try {
            const errordata = await ErrorLog.findAll();
            if (errordata) {
                return res.status(ResponseStatus.code.success).json({
                    error: false,
                    data: errordata
                });
            }
        } catch (error) {
            console.log(error)
            var logError = await ErrorLog.create({
                error_name: "Error at ErrorLog Controller",
                error_description: error.toString(),
                route: `${req.originalUrl}`,
                method: `${req.method}`,
                error_code: "500",
            });
            if (logError) {
                res.status(500).json({ error: 'server error' ,  extra: error.message });
            }

        }
    }

    static async read(req, res) {

        try {
            const logger = await TotalLog.findAll({order: [['createdAt', 'DESC']]});

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: logger });

        } catch (error) {
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }


    static async clear(req, res) {

        try {

             const logger = TotalLog.destroy({ truncate: true })

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: logger });

        } catch (error) {
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }



}
module.exports = LoggingController;