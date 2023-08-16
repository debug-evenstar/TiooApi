const { Error } = require("sequelize");
const { ErrorLog } = require("../database/connection");
const ResponseStatus = require("../config/message.config");
class ErrorLogs {

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
                res.status(500).json({ error: 'Server Error' });
            }

        }
    }
}
module.exports = ErrorLogs;