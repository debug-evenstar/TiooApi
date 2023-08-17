const jwt = require('jsonwebtoken');
const { Account, Admin, ErrorLog } = require('../database/connection');
const ResponseMessage = require('../config/message.config');

class TokenMiddleware {

    static generate = (userdata) => {
        return jwt.sign({ userdata }, process.env.JWT_SECRETE, { expiresIn: "3d" });
    }

    static verify = async (req, res, next) => {


        try {

            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Authentication failed. Token missing.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRETE);
            const email = decoded.userdata.email;

            Account.findOne({ where: { email: email } }).then(async (user) => {

                if (!user) {

                    const isAdmin = await Admin.findOne({ where: { email: email } });

                    if (isAdmin) {
                        next();
                    } else {
                        return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.unauthorized });
                    }

                }
                const encryptedData = decoded.userData;
                const fetchedData = user.dataValues;

                req.userData = fetchedData;

                next();

            }).catch((error) => {

                console.log([error, "here"]);
            });



        } catch (err) {
            var logError = await ErrorLog.create({
                error_name: "Error at Verify Middleware",
                error_description: err.toString(),
                route: `${req.originalUrl}`,
                method: `${req.method}`,
                error_code: "401",
            });

            if (logError) {
                return res.status(401).json({ message: 'Authentication failed. Token invalid.' });

            }
        }
    }


    static admin = async (req, res, next) => {

        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Admin Authentication failed. Token missing.' });
        }

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRETE);
            const email = decoded.userdata.email;

            console.log(email)

            Admin.findOne({ where: { email: email } }).then((user) => {

                console.log(user);

                if (!user) {
                    return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.adminUnauthorized });
                }

                if (user.account_type !== 'admin') {
                    return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.adminUnauthorized });
                }

                const encryptedData = decoded.userData;
                const fetchedData = user.dataValues;

                req.userData = fetchedData;

                next();

            }).catch((error) => {
                console.log(error);
            });



        } catch (err) {
            console.log(err)
            var logError = await ErrorLog.create({
                error_name: "Error at Admin Middleware",
                error_description: err.toString(),
                route: `${req.originalUrl}`,
                method: `${req.method}`,
                error_code: "401",
            });

            if (logError) {
                return res.status(401).json({ message: 'Authentication failed. Token invalid.' });
            }
        }
    }
}


module.exports = TokenMiddleware;