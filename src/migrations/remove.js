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
}


makeMigration.deleteColumn()