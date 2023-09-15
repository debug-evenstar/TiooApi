const ResponseMessage = require("../../config/message.config");
const { Keypairs, Account, Student } = require("../../database/connection");
const AuthController = require("../auth.controller");
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../config/message.config");
const jwt = require('jsonwebtoken');
class ExternalSchoolController {

    /* ------------------- ResetPassword------------------ */
    static async ResetPassword(req, res) {
        console.log(req.schoolKey)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(ResponseMessage.code.bad_request).json({ errors: errors.array() });
        }
        try {
            const data = req.body
            const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
            if (!jwtRegex.test(data.payload)) {
                return res.status(ResponseStatus.code.bad_request).json({ message: ResponseStatus.fail.bad_request });
            }
            const privateKey = req.schoolKey
            // const school = await Schoolkey.getSchoolManagement();
            const decoded = jwt.verify(data.payload, privateKey);
            if (!decoded) {
                return res.status(ResponseStatus.code.bad_request).json({ message: ResponseStatus.fail.bad_request });
            }
            const emailExist = await AuthController.validateEmail(decoded.userdata.email);
            if (!emailExist.pass) {
                return res.status(ResponseStatus.code.conflict).json({
                    error: true, message:
                        ResponseStatus.fail.not_found
                });
            }
            const user = await Account.findOne({
                where: {
                    email: decoded.userdata.email
                }
            });
            const hashPassword = await user.hashPassword(decoded.userdata.password);
            const update = await user.update({ password: hashPassword });

            if (update) {   
             console.log("update user password");
            }
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'server error', extra: error.message });

        }
    }
}
module.exports = ExternalSchoolController;