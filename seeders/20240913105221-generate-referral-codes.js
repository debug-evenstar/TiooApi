'use strict';

const { generateCode } = require("../src/utils/string");

generat
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const accounts = await queryInterface.sequelize.query(
      'SELECT id FROM accounts;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const updatePromises = accounts.map(async (account) => {
      const referralCode = generateCode();

      return queryInterface.bulkUpdate(
        'accounts',
        { referral_code: referralCode },
        { id: account.id }
      );
    });

    await Promise.all(updatePromises);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('accounts', { referral_code: null }, {});
  },
};


