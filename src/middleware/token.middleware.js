const jwt = require('jsonwebtoken');
const { Account, Admin, Keypairs, Authorization } = require('../database/connection');
const ResponseMessage = require('../config/message.config');
const { school } = require('../controller/billing.controller');

class TokenMiddleware {

    static generate = (userdata) => {
        return jwt.sign({ userdata }, process.env.JWT_SECRETE, { expiresIn: "90d" });
    }

    static verify = async (req, res, next) => {


        try {

            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Authentication failed. Token missing.' });
            }

            const Schoolkey = await Keypairs.findOne({
                where: {
                    public_key: token.toString()
                }
            });            
            if (Schoolkey) {
                req.schoolKey = Schoolkey.private_key;
                next();
                return
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

                // console.log([error.message, "here"]);
            });



        } catch (err) {
            // console.log(err);
            // if (logError) {
                return res.status(401).json({ message: 'Authentication failed. Token invalid.' });
            // }
        }
    }


    // static externalSchool = async (req, res, next) => {

    //     const token = req.headers['authorization']?.split(' ')[1];

    //     if (!token) {
    //         return res.status(401).json({ message: 'school authentication failed. public key missing.' });
    //     }
    //     try {

    //         const Schoolkey = await Keypairs.findOne({
    //             where: {
    //                 public_key: token.toString()
    //             }
    //         });
    //         if (!Schoolkey) {
    //             return res.status(ResponseStatus.code.not_found).json({ message: ResponseStatus.fail.school });
    //         }
    //         req.schoolKey = Schoolkey.private_key;
    //         next();

    //     } catch (err) {
    //         console.log(err)
    //         if (logError) {
    //             return res.status(401).json({ message: 'Authentication failed. Public Key invalid.' });
    //         }
    //     }
    // }
    static admin = async (req, res, next) => {

        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Admin Authentication failed. Token missing.' });
        }

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRETE);
            const email = decoded.userdata.email;


            Admin.findOne({ where: { email: email } }).then((user) => {

                if (!user) {
                    return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.adminUnauthorized });
                }
    
                // if (user.account_type !== 'admin') {
                //     return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.adminUnauthorized });
                // }
                

                const encryptedData = decoded.userData;
                const fetchedData = user.dataValues;

                req.userData = fetchedData;

                next();

            }).catch((error) => {
                //  console.log(error);
            });

        } catch (err) {
            console.log(err);
            return res.status(401).json({ message: 'Authentication failed. Token invalid.' });
            
        }
    }


    static checkAuthorization(requiredAuthorizations) {

        return async (req, res, next) => {

            const data = req.userData;

            const authorization = await Authorization.findByPk(data.id);

            const userAuthorizations = authorization.permissions || [];

            const hasAuthorization = requiredAuthorizations.some((authorization) =>
            
                userAuthorizations.includes(authorization)
            );

            if (hasAuthorization) {
                next();
            } else {

                res.status(403).json({ error: 'Unauthorized' });
            }
        };
    };
}


module.exports = TokenMiddleware;