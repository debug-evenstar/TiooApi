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


  static addDateColumns = async () => {
    try {
      await db.sequelize.queryInterface.addColumn('Lessons', 'start_date', {
        type: db.sequelize.Sequelize.DATE,
        allowNull: false,
        defaultValue: db.sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      });
  
      await db.sequelize.queryInterface.addColumn('Lessons', 'end_date', {
        type: db.sequelize.Sequelize.DATE,
        allowNull: false,
        defaultValue: db.sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      });
  
      console.log('start_date and end_date columns added successfully.');
    } catch (error) {
      console.error('Error adding date columns:', error);
    } finally {
      // Close the Sequelize connection
      await db.sequelize.close();
    }
  };

  static addSchoolName = async () => {
    try {
      await db.sequelize.queryInterface.addColumn('SchoolManagements', 'school_name', {
        type: db.sequelize.Sequelize.TEXT,
        allowNull: true,
        defaultValue: 'undefined',
      });
      console.log('school_name column added successfully.');
    } catch (error) {
      console.error('Error adding school_name column:', error);
    } finally {
      await db.sequelize.close();
    }
  };


static addStudentColumns = async () => {
  try {
    // Add the 'parent' column
    await db.sequelize.queryInterface.addColumn('Students', 'parent', {
      type: db.sequelize.Sequelize.STRING,
      defaultValue: 'undefined',
      allowNull: false,
    });

    // Add the 'class' column
    await db.sequelize.queryInterface.addColumn('Students', 'class', {
      type: db.sequelize.Sequelize.STRING,
      defaultValue: 'undefined',
      allowNull: false,
    });

    // Add the 'school' column
    await db.sequelize.queryInterface.addColumn('Students', 'school', {
      type: db.sequelize.Sequelize.STRING,
      defaultValue: 'undefined',
      allowNull: false,
    });

    // Add the 'age' column
    await db.sequelize.queryInterface.addColumn('Students', 'age', {
      type: db.sequelize.Sequelize.INTEGER,
      defaultValue: '23',
      allowNull: false,
    });

    console.log('Columns added to the Students table successfully.');
  } catch (error) {
    console.error('Error adding columns to the Students table:', error);
  } finally {
    await db.sequelize.close();
  }

};



}


makeMigration.addAdmin();


