const jwt = require('jsonwebtoken');
const { Account } = require('../database/connection');
const ResponseMessage = require('../config/message.config');

class TokenMiddleware {

    static generate = (userdata) => {
        return jwt.sign({ userdata }, process.env.JWT_SECRETE, { expiresIn: "3d" });
    }

    static verify = (req, res, next) => {

        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed. Token missing.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRETE);
            const id = decoded.userdata.id;
            
            Account.findOne({ where: { id: id } }).then((user) => {
                
                if(!user){
                    return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.unauthorized });
                }
                const encryptedData = decoded.userData;
                const fetchedData = user.dataValues;

                req.userData = fetchedData;

                next();

            }).catch((error) => {
                console.log(error);
            });



        } catch (err) {
            return res.status(401).json({ message: 'Authentication failed. Token invalid.' });
        }
    }
}


module.exports = TokenMiddleware;