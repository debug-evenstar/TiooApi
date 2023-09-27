const ResponseStatus = require("../config/message.config");
const { Account, Chapter, CartItem } = require("../database/connection");

class CartController {

    static async add(req, res) {

        const { id } = req.userData
        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            const cartItemInstance = await CartItem.create(req.body);

           const data =  await accountInstance.addCartItem(cartItemInstance);

           const response = await accountInstance.getCartItems();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.added, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

    static async remove(req, res) {

        const { id } = req.params

        const account_id = req.query.account_id ? req.query.account_id : req.userData.id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            const cartItemInstance = await CartItem.findByPk(id);

            if (!cartItemInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

           await cartItemInstance.destroy();

           const response = await accountInstance.getCartItems();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.removed, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }


    static async read(req, res) {

        const { id } = req.params

        const account_id = req.query.account_id ? req.query.account_id : req.userData.id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            const response = await accountInstance.getCartItems();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };
    }

}

module.exports = CartController;