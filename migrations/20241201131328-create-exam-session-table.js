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
    await queryInterface.createTable('exam_sessions',{
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      exam_set_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'exam_sets',
          key: 'id',
          onDelete: 'cascade',
        }
      },

      account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'accounts',
          key: 'id',
          onDelete: 'cascade',
        }
      },

      slides: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      answers: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      score: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('exam_sessions');
  }
};
