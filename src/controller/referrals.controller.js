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
        attributes: ['id','name','email']
      }],
      attributes: ['created_at']
    })

    return res.send({
      error: false,
      data: referrals.map((u) => ({ created_at: u.created_at, ...u.Account.dataValues}))
    })

  }


}


module.exports = ReferralController