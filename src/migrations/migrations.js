const { db } = require("../database/connection")

class makeMigration {

  static deleteColumn = async () => {
    try {
      await db.sequelize.getQueryInterface().removeColumn('Teachers', 'teacher_type');
      console.log('Column deleted successfully.');
    } catch (error) {
      console.error('Error deleting column:', error);
    } finally {
      // Close the Sequelize connection
      await db.sequelize.close();
    }
  };


  static addTeacherTypeColumn = async () => {
    try {
      await db.sequelize.queryInterface.addColumn('Teachers', 'teacher_type', {
        type: db.sequelize.Sequelize.STRING,
        allowNull: true,
        defaultValue: 'school',
      });
      console.log('teacher_type column added successfully.');
    } catch (error) {
      console.error('Error adding teacher_type column:', error);
    } finally {
      // Close the Sequelize connection
      await db.sequelize.close();
    }
  };

}

// module.exports = makeMigration;


makeMigration.addTeacherTypeColumn()