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
    await queryInterface.addColumn('study_plans', 'target_scores', {
      type: Sequelize.JSON,
      allowNull: false,
    })
    await queryInterface.addColumn('study_plans', 'vision_statement', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('study_plans','target_scores');
    await queryInterface.removeColumn('study_plans','vision_statement');
  }
};

