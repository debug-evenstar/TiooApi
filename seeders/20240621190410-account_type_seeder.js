"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // queryInterface.bulkDelete('account_types',null,{});

    const data = [
      { name: "Parent", created_at: new Date(), updated_at: new Date() },
      { name: "Student", created_at: new Date(), updated_at: new Date() },
      { name: "School", created_at: new Date(), updated_at: new Date() },
      { name: "Tutor", created_at: new Date(), updated_at: new Date() },
      { name: "Agent", created_at: new Date(), updated_at: new Date() },
    ];

    await queryInterface.bulkInsert('account_types',data,{});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    queryInterface.bulkDelete("account_types", null, {});
  },
};
