'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('onboarding_questions',{
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
      },

      parent_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          key: 'id',
          model: "onboarding_questions",
        },
      },

      parent_answer: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      
      question: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      options: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('onboarding_questions');
  }
};
