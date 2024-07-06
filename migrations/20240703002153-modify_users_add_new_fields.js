'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return Promise.all([
      queryInterface.addColumn(
        'accounts',
        'metadata',
        {
          type: Sequelize.JSON
        },
      ),
      queryInterface.addColumn(
        'accounts',
        'onboarded',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      ),
      queryInterface.addColumn('accounts','shelf',{
        type: Sequelize.JSON
      })
    ])
    
    // queryInterface.addColumn('users');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     *

     */

    await queryInterface.removeColumn('accounts','shelf');
    await queryInterface.removeColumn('accounts','metadata');
    await queryInterface.removeColumn('accounts','onboarded');
  }
};
