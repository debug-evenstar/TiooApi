const { Op } = require("sequelize");
const { Referral, Account } = require("../database/connection");

class ReferralController {

  static async getUserReferrals(req, res) {
    const userData = req.userData;

    // const referrals = await Referral.findAll({
    //   where: {
    //     referrer_id: userData.id,
    //     include: [
    //       {
    //         model: Account,
    //         // as: 'ReferredUser',
    //         attributes: ['id', 'name', 'email'], 
    //       },
    //     ]
    //   }
    // })

    const referrals = await Referral.findAll({
      where: {
        referrer_id: userData.id
      },
      include: [{
        model: Account,
        as: 'referred_account',
        attributes: ['id','name','email']
      }],
      attributes: ['created_at']
    })

    const data = referrals.map((u) => ({ created_at: u.created_at, ...u.referred_account.dataValues}))
    return res.send({
      error: false,
      data: data
    })

  }


}


module.exports = ReferralController