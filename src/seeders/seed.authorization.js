const { Role, Permission } = require('../database/connection/index');

  const permissionsData = [
    { name: 'Manage School', code: 'manage_school' },
    { name: 'Manage Freelancer', code: 'manage_freelancer' },
    { name: 'Manage Teacher', code: 'manage_teacher' },
    { name: 'Manage Students', code: 'manage_students' },
    { name: 'Manage Library', code: 'manage_library' },
    { name: 'Manage Marketplace', code: 'manage_marketplace' },

  ];

  class AuthorizationSeed{

    static permission = async () => {
        try {
          const createdPermissions =  await Permission.bulkCreate(permissionsData);
            console.log('Seeding completed successfully.', createdPermissions);
          } catch (error) {
            console.error('Error seeding data:', error);
          }
    };

  }


  module.exports = AuthorizationSeed;
