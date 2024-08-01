'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const permissionsData = [
      { name: 'Manage School', code: 'manage_school', account: 'admin' },
      { name: 'Manage Freelancer', code: 'manage_freelancer', account: 'admin' },
      { name: 'Manage Teacher', code: 'manage_teacher', account: 'admin' },
      { name: 'Manage Students', code: 'manage_students', account: 'admin' },
      { name: 'Manage Library', code: 'manage_library', account: 'admin' },
      { name: 'Manage Marketplace', code: 'manage_marketplace', account: 'admin' },
      { name: 'Manage Admin', code: 'manage_admin', account: 'admin' },
    ]
    await queryInterface.bulkInsert('permissions', permissionsData, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions',null,{});
  }
};
