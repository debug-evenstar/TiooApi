const { db } = require("../database/connection")

class makeMigration {

  static addTeacherTypeColumn = async () => {
    try {
      await db.sequelize.queryInterface.addColumn('Teachers', 'teacher_type', {
        type: db.sequelize.Sequelize.STRING,
        allowNull: true,
        defaultValue: 'subject',
      });
      console.log('teacher_type column added successfully.');
    } catch (error) {
      console.error('Error adding teacher_type column:', error);
    } finally {
      await db.sequelize.close();
    }
  };


  static addAdmin = async () => {
    try {
      await db.sequelize.queryInterface.addColumn('Accounts', 'admin', {
        type: db.sequelize.Sequelize.STRING,
        allowNull: true,
        defaultValue: 'undefined',
      });
      console.log('admin column added successfully.');
    } catch (error) {
      console.error('Error adding admin column:', error);
    } finally {
      // Close the Sequelize connection
      await db.sequelize.close();
    }
  };

}


makeMigration.addAdmin()