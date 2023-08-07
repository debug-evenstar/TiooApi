const { Account, Validation } = require('../model/database/index');

const accountHolder = {
    name: "Williams Mark Jerry",
    email: "student1@gmail.com",
    phone: "08093652637",
    account_type: "student",
    password: "1234"
};

const randomOTP = Math.floor(Math.random() * 900000) + 100000;

class Seed {

    static verifyOTP = async () => {

        try {

            const reqOTP = "698322"; //update to recieved otp

            const reqEmail = accountHolder.email;

            const registerdAccount = await Account.findOne({ where: { email: reqEmail } });

            const setValidation = await Validation.findOne({ where: { accountId: registerdAccount.dataValues.id } });

            const isExpired = setValidation.compareExpiryDate();

            const isValidOTP = await setValidation.compareOTP(reqOTP);

            if (isExpired) {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.expired_token });
            }

            if (isValidOTP) {
                await registerdAccount.update({ verification_status: 1, });
                console.log('Product seeded successfully!', isValidOTP);
            }


        } catch (error) {
            console.error('Error seeding database:', error);
        } finally {
            process.exit();
        }
    };

}

Seed.verifyOTP();
