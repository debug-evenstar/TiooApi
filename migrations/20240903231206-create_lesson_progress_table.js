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

    await queryInterface.createTable('lesson_progress', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      textbook_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      slide_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      slide_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });


    await queryInterface.addConstraint('lesson_progress', {
      fields: ['student_id', 'textbook_id', 'lesson_id'],
      type: 'unique',
      name: 'unique_student_textbook_lesson', // Unique constraint name
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('lesson_progress');
  }
};
