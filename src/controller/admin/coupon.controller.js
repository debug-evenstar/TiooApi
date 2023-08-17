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

            console.log(response);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
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
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }

}


module.exports = CouponController;