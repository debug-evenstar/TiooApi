const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Permission, Admin, Authorization, Preference, } = require('../database/connection');
const SyncDB = require('../server/syncDatabase');
const AuthorizationSeed = require('../seeders/seed.authorization');

class PreferenceController {

    /*-----------------------------------| CREATE SCHOOL PREFERENCE |-----------------------------------*/

    static async create(req, res) {

        const { id } = req.userData

        const account_id = req.query.school_id ? req.query.school_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const preferenceInstance = await Preference.create(req.body);

            const response = await accountInstance.setPreference(preferenceInstance)

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create, data: response
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    /*-----------------------------------| CREATE TEACHER PREFERENCE |-----------------------------------*/

    static async teachearCreate(req, res) {

        const { id } = req.userData

        const account_id = req.query.school_id ? req.query.school_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const preferenceInstance = await Preference.create(req.body);

            const response = await accountInstance.setPreference(preferenceInstance)

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create, data: response
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    static async update(req, res) {

        const { id } = req.userData

        const account_id = req.query.school_id ? req.query.school_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const preferenceInstance = await accountInstance.getPreference();

            if (!preferenceInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: "No Preference setup" });
            }

            const response = await preferenceInstance.update(req.body);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update, data: response
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    static async setStudentPreference(req, res) {

        const { id } = req.userData

        const account_id = req.query.school_id ? req.query.school_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const preferenceInstance = await accountInstance.getPreference();

            let response;

            if (!preferenceInstance) {
                const createdPreferenceInstance = await Preference.create(req.body);
                response = await accountInstance.setPreference(createdPreferenceInstance)

            } else {
                response = await preferenceInstance.update(req.body);
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update, data: response
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    static async read(req, res) {

        const { id } = req.userData

        const account_id = req.query.school_id ? req.query.school_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const preferenceInstance = await accountInstance.getPreference();

            if (!preferenceInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: "No Preference setup" });
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update, data: preferenceInstance
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };



}


module.exports = PreferenceController;
