
const ResponseStatus = require("../config/message.config");
const { Account, Notification, Subscription } = require("../database/connection");


class NotificationController {


    static async subscription(req, res) {

        const { id } = req.userData;
        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            let subscriptionInstance = await accountInstance.getSubscriptions({ include: [Notification] });

            if (subscriptionInstance.length == 0) {

                const notificationInstances = await Notification.findAll();

                for (let notification of notificationInstances) {

                    const payload = { device_id: 'none', status: false, NotificationId: notification.id, AccountId: accountInstance.id }

                    const subscription = await Subscription.create(payload);

                }

                subscriptionInstance = await accountInstance.getSubscriptions({ include: [Notification] });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subscriptionInstance });

        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    static async update(req, res) {

        const { id } = req.userData;
        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            let subscriptionInstances = await accountInstance.getSubscriptions();

            const body = req.body.subscriptions.filter((element)=>({status: element.status, device_id: req.body.device_id }));

            const ids = req.body.subscriptions.filter((element)=> element);

            for(var i = 0; i < subscriptionInstances.length; i++){

                await subscriptionInstances[i].update(body[i]);

            }

            subscriptionInstances = await accountInstance.getSubscriptions({include: [Notification]});

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subscriptionInstances});

        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



}
module.exports = NotificationController;