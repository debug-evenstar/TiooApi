'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    queryInterface.createTable('exams', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,

      },

      image_path: {
        type: Sequelize.STRING,
        allowNull: true
      },

      exam_type: {
        type: Sequelize.STRING,
        allowNull: true
      },

      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },

      university_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('exams');
  }

};
