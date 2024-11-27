'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('account_exam', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subjects: {
        type: Sequelize.JSON,
        allowNull: true,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('account_exam');

  }
};
