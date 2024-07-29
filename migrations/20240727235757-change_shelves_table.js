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

    await queryInterface.removeColumn('shelves','textbook_id');
    await queryInterface.changeColumn('shelves','account_id', {
      unique: true,
      type: Sequelize.INTEGER,
      allowNull:false,
    });

    await queryInterface.addColumn('shelves','shelf', {
      type: Sequelize.JSON,
      defaultValue: []
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('shelves','shelf');
    await queryInterface.changeColumn('shelves','account_id', {
      unique: false,
      allowNull: false,
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('shelves','textbook_id', {
      type: Sequelize.INTEGER
    });
  }
};
