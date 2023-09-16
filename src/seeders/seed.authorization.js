const { Role, Permission } = require('../database/connection/index');

  const permissionsData = [
    { name: 'Manage School', code: 'manage_school', account: 'admin' },
    { name: 'Manage Freelancer', code: 'manage_freelancer', account: 'admin' },
    { name: 'Manage Teacher', code: 'manage_teacher', account: 'admin' },
    { name: 'Manage Students', code: 'manage_students', account: 'admin' },
    { name: 'Manage Library', code: 'manage_library', account: 'admin' },
    { name: 'Manage Marketplace', code: 'manage_marketplace', account: 'admin' },
    { name: 'Manage Admin', code: 'manage_admin', account: 'admin' },

  ];

  const schoolRolesData = [
    { name: 'HeadMistress', code: 'headmistress' , account: 'school'},
    { name: 'Head Teacher', code: 'headteacher', account: 'school' },
    { name: 'Principal', code: 'principal' , account: 'school'},
    { name: 'Supervisor', code: 'supervisor' , account: 'school'},
  ];

  class AuthorizationSeed{

    static permission = async () => {
        try {
          const createdPermissions =  await Permission.bulkCreate(permissionsData);
            console.log('Seeding completed successfully.');
          } catch (error) {
            console.error('Error seeding data:', error);
          }
    };

    static schoolPermission = async () => {
      try {
        const createdPermissions =  await Permission.bulkCreate(schoolRolesData);
          console.log('Seeding completed successfully.');
        } catch (error) {
          console.error('Error seeding data:', error);
        }
  };

  }


  module.exports = AuthorizationSeed;
