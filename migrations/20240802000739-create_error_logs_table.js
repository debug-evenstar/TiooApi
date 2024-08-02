"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    queryInterface.createTable("error_logs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      error_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      error_description: {
        type: Sequelize.STRING,
      },

      route: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      error_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('error_logs');

  },
};
