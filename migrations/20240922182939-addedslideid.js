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
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'questions',
      'slide_id',
      {
        type: Sequelize.INTEGER,
        references:{
          key: "id",
          model: "lesson_slides",
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      }
   
   
    
     
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
