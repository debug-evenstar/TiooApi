const AuthController = require('../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../config/message.config");
const { Account, Authorization, Permission, Validation, Admin, Coupon } = require('../../database/connection');




class CouponController {

    /*-----------------------------------| CREATE COUPON |-----------------------------------*/

    static async create(req, res) {

        const errors = validationResult(req);

        const data = req.body;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const accountInstance = await Account.findAll({ where: { id: data.users } });

            const couponInstance = await Coupon.create(data);

            const response = await couponInstance.addAccounts(accountInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }

    /*-----------------------------------| READ COUPONS |-----------------------------------*/

    static async read(req, res) {

        try {

            const couponInstances = await Coupon.findAll();

            const response = await Promise.all(couponInstances.map(async (coupon) => {
                const data = await coupon.getAccounts({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                const payload = { ...coupon.dataValues };
                payload.users = data.length;
                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: response
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }



    /*-----------------------------------| ACTIVATE COUPONS |-----------------------------------*/

    static async activate(req, res) {


        const errors = validationResult(req);

        const data = req.body;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const couponInstances = await Coupon.findByPk(data.id);

            if (!couponInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found,
                    data: {}
                });
            }

            const response = await couponInstances.update({ status: data.activate === true ? 'Active' : 'Inactive' });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: response
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    /*-----------------------------------| DELETE COUPON |-----------------------------------*/

    static async delete(req, res) {

        const { id } = req.query;

        try {

            const couponInstances = await Coupon.findByPk(id);

            if (!couponInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            await couponInstances.destroy();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.delete,
                data: couponInstances
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    /*-----------------------------------| UPDATE COUPON |-----------------------------------*/

    static async update(req, res) {

        const data = req.body;

        try {

            const couponInstances = await Coupon.findByPk(data.id);

            if (!couponInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await couponInstances.update(data);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.update,
                data: response
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    /*-----------------------------------| UPDATE COUPON |-----------------------------------*/

    static async apply(req, res) {

        const data = req.body;

        try {

            const couponInstances = await Coupon.findOne({ where: { code: req.body.code }, include: [Account] });

            if (!couponInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            if (couponInstances.status != 'Active') {
                return res.status(ResponseStatus.code.forbidden).json({ error: true, message: 'Token is not active' });
            }

            const accessibilty = couponInstances.Accounts.filter((element) => element.id == req.body.account);


            if (accessibilty.length == 0) {
                return res.status(ResponseStatus.code.forbidden).json({ error: true, message: 'This user is not covered by this coupon' });
            }

            const response = {
                "campaign": couponInstances.campaign,
                "code": couponInstances.code,
                "status": couponInstances.status,
                "amount": couponInstances.amount,
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: response
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }

}


module.exports = CouponController;