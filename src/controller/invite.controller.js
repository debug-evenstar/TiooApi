const ResponseStatus = require("../config/message.config");
const { validationResult, param } = require('express-validator');
const { Invite } = require("../database/connection");


class InviteController {

    /*-----------------------------------| GENERATE REFERRAL CODE |-----------------------------------*/

    static generateReferralCode(length) {

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let referralCode = '';

        for (let i = 0; i < length; i++) {
            referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return referralCode;
    }

    /*-----------------------------------| GENERATE INVITE LINK |-----------------------------------*/

    static async generateLink(req, res) {

        try {

            req.body.code = InviteController.generateReferralCode(8);

            console.log(req.body);

            const inviteInstance = await Invite.create(req.body);

            const link = `http://127.0.0.1:8085/api/${req.body.account_type}/invited/${inviteInstance.code}`;

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: { link } });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ ALL INVITES |-----------------------------------*/

    static async invites(req, res) {

        try {

            const inviteInstance = await Invite.findAll();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: inviteInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ INVITE BY ID |-----------------------------------*/

    static async invite(req, res) {

        const { id } = req.params;

        try {

            const inviteInstance = await Invite.findByPk(id);


            if (!inviteInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: inviteInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ BY INVITE CODE |-----------------------------------*/

    static async inviteByCode(req, res) {

        const { code } = req.params;

        try {

            const inviteInstance = await Invite.findOne({ where: { code: code } });


            if (!inviteInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }


            const payload = {
                "name": "",
                "email": "",
                "account_type": inviteInstance.account_type,
                "flag": "invited",
                "classes": inviteInstance.classes,
                "Subjects": inviteInstance.subjects,
                "schoolId": inviteInstance.schoolId
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| DELETE INVITE BY ID |-----------------------------------*/

    static async delete(req, res) {

        const { id } = req.params;

        try {

            const inviteInstance = await Invite.findByPk(id);

            if (!inviteInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await inviteInstance.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }
}

module.exports = InviteController;